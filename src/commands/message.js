const { Command } = require("sheweny");

module.exports = class MessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: "message",
      description: "commande pour envoyer un message",
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
    interaction.reply({
      content: `${message}`
    })
  }
}

