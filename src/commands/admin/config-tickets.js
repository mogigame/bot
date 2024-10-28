const { Command } = require('sheweny');
const fs = require('fs');
const path = require('path');

module.exports = class ConfigTicketCategoriesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config-tickets',
            description: 'Configurer les catégories des tickets',
            type: 'SLASH_COMMAND',
            category: 'Admin',
            cooldown: 3,
            options: [
                {
                    name: 'categorie_ticket_ouverte',
                    description: 'ID de la catégorie pour les tickets ouverts',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'categorie_ticket_fermee',
                    description: 'ID de la catégorie pour les tickets fermés',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'categorie_archive',
                    description: 'ID de la catégorie pour les tickets archivés',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'log_channel',
                    description: 'ID du salon pour les logs',
                    type: 'STRING',
                    required: true,
                }
            ],
        });
    }

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
        }

        const openCategoryID = interaction.options.getString('categorie_ticket_ouverte');
        const closeCategoryID = interaction.options.getString('categorie_ticket_fermee');
        const archiveCategoryID = interaction.options.getString('categorie_archive');
        const logChannelID = interaction.options.getString('log_channel');

        const configPath = path.resolve(__dirname, '../../../config.json'); 

        let config;

        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf-8');
            config = JSON.parse(configData);
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

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await interaction.reply({ content: 'Les catégories des tickets ont été mises à jour avec succès.', ephemeral: true });
    }
};
