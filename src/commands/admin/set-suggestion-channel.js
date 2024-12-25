const { Command } = require("sheweny");
const fs = require('fs');
const path = require('path');
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = class SetSuggestionChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "set_suggestion_channel",
      description: "Définit le salon où les suggestions seront envoyées",
      type: 'SLASH_COMMAND',
      category: "Admin",
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
          name: "channel",
          description: "Le salon où les suggestions seront envoyées",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        }
      ],
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'Vous devez être administrateur pour utiliser cette commande.', ephemeral: true });
    }

    const configPath = path.resolve(__dirname, '../../../config.json');
    let config = {};

    try {
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } else {
        config.suggestionChannelId = null;
      }

      config.suggestionChannelId = channel.id;

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      interaction.reply({ content: `Le salon pour les suggestions a été défini sur ${channel}.`, ephemeral: true });
    } catch (error) {
      console.error(`Erreur lors de la lecture/écriture du fichier de configuration : ${error.message}`);
      interaction.reply({ content: "Une erreur est survenue lors de la mise à jour du fichier de configuration.", ephemeral: true });
    }
  }
};
