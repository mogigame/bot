const { Command } = require("sheweny");
const { MessageEmbed, WebhookClient } = require("discord.js");
const fs = require('fs');
const path = require('path');

module.exports = class MessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: "message",
      description: "commande pour envoyer un message anonyme",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "msg",
          description: "met un message ",
          type: "STRING",
          required: true
        }
      ],
    });
  }

  async execute(interaction) {
    const message = interaction.options.getString("msg")
    const embed = new MessageEmbed()
      .setAuthor("Anonymous")
      .setDescription(message)
      .setColor('#0099ff');

    // Create a new webhook
    const webhook = await interaction.channel.createWebhook('Anonymous', {
      avatar: 'https://www.dropbox.com/scl/fi/p7bogdxlpyacgngq4x6rz/loupe.png?rlkey=q4rqqfr4vhob3ag28mpdu9q2u&dl=1',
    });

    // Create a new webhook client
    const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

    // Send a message using the webhook
    await webhookClient.send({
      username: 'Anonymous',
      embeds: [embed],
    });

    // Delete the webhook after use
    await webhook.delete();

    // Create the log directory if it doesn't exist
    const logDir = path.join(__dirname, '..', 'log');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // Write the message and the user who sent it to a .log file
    const logMessage = `${interaction.user.tag}: ${message}\n`;
    fs.appendFile(path.join(logDir, 'MessagesAnonyme.log'), logMessage, (err) => {
      if (err) console.error(err);
    });

    // Acknowledge the interaction without sending a message
    await interaction.reply({ content: 'Le message a été envoyer en anonyme.', ephemeral: true });
  }
}