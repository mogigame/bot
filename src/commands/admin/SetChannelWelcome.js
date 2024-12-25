const { Command } = require('sheweny');
const { MessageEmbed, ChannelType, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class SetChannelWelcomeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set_channel_welcome',
      description: 'Définit un salon pour souhaiter la bienvenue',
      type: 'SLASH_COMMAND',
      category: 'Misc',
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
          name: 'channel',
          description: 'Salon où les utilisateurs seront accueillis',
          type: ApplicationCommandOptionType.Channel,
          required: true,
        }
      ],
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Le salon de bienvenue doit être un salon textuel.', ephemeral: true });
    }

    const configPath = path.resolve(__dirname, '../../../config.json');
    let config = {};

    try {
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } else {
        config = { welcomeChannelID: null };
      }

      if (config.welcomeChannelID === channel.id) {
        return interaction.reply({ content: `Le salon de bienvenue est déjà défini sur <#${channel.id}>.`, ephemeral: true });
      }

      config.welcomeChannelID = channel.id;

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

      return interaction.reply({ content: `Le salon de bienvenue a été mis à jour : <#${channel.id}>`, ephemeral: true });

    } catch (error) {
      console.error(`Erreur lors de la lecture/écriture du fichier de configuration : ${error.message}`);
      return interaction.reply({ content: 'Une erreur est survenue lors de la mise à jour de la configuration.', ephemeral: true });
    }
  }
};
