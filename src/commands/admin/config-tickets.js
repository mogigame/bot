const { Command } = require('sheweny');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class ConfigTicketCategoriesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'config-tickets',
      description: 'Configurer les catégories des tickets',
      type: 'SLASH_COMMAND',
      cooldown: 3,
      category: 'Admin',
      userPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
          name: 'categorie_ticket_ouverte',
          description: 'ID de la catégorie pour les tickets ouverts',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'categorie_ticket_fermee',
          description: 'ID de la catégorie pour les tickets fermés',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'categorie_archive',
          description: 'ID de la catégorie pour les tickets archivés',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'log_channel',
          description: 'ID du salon pour les logs',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const openCategoryID = interaction.options.getString('categorie_ticket_ouverte');
    const closeCategoryID = interaction.options.getString('categorie_ticket_fermee');
    const archiveCategoryID = interaction.options.getString('categorie_archive');
    const logChannelID = interaction.options.getString('log_channel');

    const configPath = path.resolve(__dirname, '../../../config.json');

    let config;
    if (fs.existsSync(configPath)) {
      try {
        const configData = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(configData);
      } catch (err) {
        return interaction.reply({
          content: '❌ Une erreur est survenue lors de la lecture du fichier de configuration.',
          ephemeral: true,
        });
      }
    } else {
      config = {
        openCategoryID: '',
        closeCategoryID: '',
        archiveCategoryID: '',
        logChannelID: '',
      };
    }

    config.openCategoryID = openCategoryID;
    config.closeCategoryID = closeCategoryID;
    config.archiveCategoryID = archiveCategoryID;
    config.logChannelID = logChannelID;

    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      await interaction.reply({
        content: '✅ Les catégories des tickets ont été mises à jour avec succès.',
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de la sauvegarde de la configuration.',
        ephemeral: true,
      });
    }
  }
};
