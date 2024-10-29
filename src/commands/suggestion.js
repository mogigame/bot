const { Command } = require("sheweny");
const { MessageEmbed } = require('discord.js');

module.exports = class SuggestionCommand extends Command {
  constructor(client) {
    super(client, {
      name: "suggestion",
      description: "Commande qui donne une suggestion au staff",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "message",
          description: "Quelle est votre suggestion ?",
          type: "STRING",
          required: true,
        }
      ]
    });
  }

  async execute(interaction) {
    const suggestionMessage = interaction.options.getString('message');

    const channelId = this.client.suggestionChannelId;
    if (!channelId) {
      return interaction.reply({ content: 'Le salon pour les suggestions n\'a pas été défini. Veuillez demander à un administrateur de le configurer.', ephemeral: true });
    }

    const channel = await this.client.channels.fetch(channelId);

    if (!channel) {
      return interaction.reply({ content: 'Salon pour les suggestions non trouvé.', ephemeral: true });
    }

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Nouvelle Suggestion de ' + interaction.user.tag)
      .setDescription(suggestionMessage)
      .setTimestamp()
      .setFooter({ text: 'Suggestion envoyée' });

    channel.send({ embeds: [embed] })
      .then(() => {
        interaction.reply({ content: 'Votre suggestion a été envoyée au staff.', ephemeral: true });
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi de l\'embed:', error);
        interaction.reply({ content: 'Une erreur est survenue en envoyant votre suggestion.', ephemeral: true });
      });
  }
};
