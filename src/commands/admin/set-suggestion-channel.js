const { Command } = require("sheweny");
const fs = require('fs');

module.exports = class SetSuggestionChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "set-suggestion-channel",
      description: "Définit le salon où les suggestions seront envoyées",
      type: "SLASH_COMMAND",
      category: "Admin",
      cooldown: 3,
      options: [
        {
          name: "channel",
          description: "Le salon où les suggestions seront envoyées",
          type: "CHANNEL",
          required: true,
        }
      ]
    });
  }

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'Vous devez être administrateur pour utiliser cette commande.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    config.suggestionChannelId = channel.id;
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2), 'utf8');

    interaction.reply({ content: `Le salon pour les suggestions a été défini sur ${channel}.`, ephemeral: true });
  }
};
