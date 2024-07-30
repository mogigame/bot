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
    // Récupère la suggestion de l'utilisateur
    const suggestionMessage = interaction.options.getString('message');

    // Vérifie si le salon pour les suggestions a été configuré
    const channelId = this.client.suggestionChannelId;
    if (!channelId) {
      return interaction.reply({ content: 'Le salon pour les suggestions n\'a pas été défini. Veuillez demander à un administrateur de le configurer.', ephemeral: true });
    }

    // Récupère le salon où envoyer la suggestion
    const channel = await this.client.channels.fetch(channelId);

    if (!channel) {
      return interaction.reply({ content: 'Salon pour les suggestions non trouvé.', ephemeral: true });
    }

    // Crée un embed pour la suggestion
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Nouvelle Suggestion de ' + interaction.user.tag)
      .setDescription(suggestionMessage)
      .setTimestamp()
      .setFooter({ text: 'Suggestion envoyée' });

    // Envoie l'embed dans le salon
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
