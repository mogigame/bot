const { Command } = require("sheweny");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, EmbedBuilder, AttachmentBuilder } = require('discord.js'); // Ajouter AttachmentBuilder ici
const fs = require('fs');
const path = require('path');


const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config.json')));

const ticketNumberFile = path.resolve(__dirname, '../../logs/tickets/ticketNumber.json');



module.exports = class TicketMessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ticket-message',
            description: 'Envoie un message avec un bouton pour créer un ticket.',
            category: 'Admin',
            type: 'SLASH_COMMAND',
            enabled: true,
            userPermissions: [PermissionsBitField.Flags.Administrator],
        });
    }

    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Créer un Ticket')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: 'Cliquez sur le bouton ci-dessous pour créer un ticket.',
            components: [row],
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;


            if (interaction.customId === 'create_ticket') {
                try {
                    let ticketNumber = 1;
                    if (fs.existsSync(ticketNumberFile)) {
                        const data = JSON.parse(fs.readFileSync(ticketNumberFile));
                        ticketNumber = data.lastTicketNumber + 1;
                    }

                    const categoryId = config.openCategoryID;
                    const category = interaction.guild.channels.cache.get(categoryId);

                    if (!category) {
                        return interaction.reply({ content: 'La catégorie pour les tickets est introuvable.', ephemeral: true });
                    }

                    const ticketChannel = await interaction.guild.channels.create({
                        name: `ticket-#${ticketNumber}`,
                        type: ChannelType.GuildText,
                        parent: categoryId,
                        topic: `Ticket créé par ${interaction.user.tag}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });

                    const welcomeEmbed = new EmbedBuilder()
                        .setColor('#0099FF')
                        .setTitle('Bienvenue dans votre ticket!')
                        .setDescription(`Salut ${interaction.user.username}, un membre du staff va bientôt s'occuper de votre demande. \n\nMerci de ne pas supprimer ce ticket. Si vous avez terminé, cliquez sur le bouton de fermeture !`)
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Assistance en cours', iconURL: interaction.guild.iconURL() });

                    const actionRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('Fermer le Ticket')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('claim_ticket')
                            .setLabel('Prendre en Charge')
                            .setStyle(ButtonStyle.Primary)
                    );

                    await ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow] });

                    fs.writeFileSync(ticketNumberFile, JSON.stringify({ lastTicketNumber: ticketNumber }));

                    await interaction.reply({
                        content: `Ticket créé : <#${ticketChannel.id}>`,
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error('Erreur lors de la création du ticket :', error);
                    await interaction.reply({
                        content: 'Une erreur est survenue lors de la création du ticket. Vérifiez les permissions du bot et la configuration.',
                        ephemeral: true,
                    });
                }
            }

            if (interaction.customId === 'claim_ticket') {
                try {
                    const logsDataDirectory = path.resolve(__dirname, '../../logs/tickets/data');
                    const ticketChannel = interaction.channel;
                    const staffMember = interaction.member; // Modérateur ayant cliqué

                    // Vérifiez si le modérateur a déjà pris en charge ce ticket
                    const existingMessage = await ticketChannel.messages.fetchPinned();
                    if (existingMessage.size > 0 && existingMessage.first().content.includes('pris en charge par')) {
                        return interaction.reply({
                            content: 'Ce ticket est déjà pris en charge.',
                            ephemeral: true,
                        });
                    }

                    // Envoyer un message dans le canal pour notifier que le staff a pris en charge le ticket
                    const chargeEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('Ticket pris en charge')
                        .setDescription(`Ce ticket est désormais pris en charge par ${staffMember.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: 'Prise en charge', iconURL: interaction.guild.iconURL() });

                    const message = await ticketChannel.send({ embeds: [chargeEmbed] });

                    // Épingler ce message pour le rendre visible en haut
                    await message.pin();

                    await interaction.reply({
                        content: `Vous avez pris en charge ce ticket.`,
                        ephemeral: true,
                    });

                    // Enregistrer le modérateur responsable dans un fichier local pour les logs

                    const ticketDataFile = path.join(logsDataDirectory, `${ticketChannel.name}.json`);
                    let ticketData = {};

                    if (fs.existsSync(ticketDataFile)) {
                        ticketData = JSON.parse(fs.readFileSync(ticketDataFile));
                    }

                    ticketData.staff = staffMember.user.tag; // Enregistrer le modérateur

                    fs.writeFileSync(ticketDataFile, JSON.stringify(ticketData, null, 2));
                } catch (error) {
                    console.error('Erreur lors de la prise en charge du ticket :', error);
                    await interaction.reply({
                        content: 'Une erreur est survenue lors de la prise en charge du ticket.',
                        ephemeral: true,
                    });
                }
            }


            if (interaction.customId === 'close_ticket') {
                try {
                    const ticketChannel = interaction.channel;
                    const closeCategoryId = config.closeCategoryID;
                    const closeCategory = interaction.guild.channels.cache.get(closeCategoryId);

                    if (!closeCategory) {
                        return interaction.reply({ content: 'La catégorie de fermeture est introuvable.', ephemeral: true });
                    }

                    await ticketChannel.setParent(closeCategoryId);

                    const closeEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Ticket Fermé')
                        .setDescription(`Le ticket a été fermé par ${interaction.user.username}. Si vous souhaitez l'archiver ou supprimer, cliquez sur les boutons ci-dessous.`)
                        .setTimestamp()
                        .setFooter({ text: 'Ticket fermé', iconURL: interaction.guild.iconURL() });

                    const actionRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('archive_ticket')
                            .setLabel('Archiver le Ticket')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('delete_ticket')
                            .setLabel('Supprimer le Ticket')
                            .setStyle(ButtonStyle.Danger)
                    );

                    await ticketChannel.send({ embeds: [closeEmbed], components: [actionRow] });
                    await interaction.reply({ content: 'Le ticket a été fermé et déplacé vers la catégorie fermée.', ephemeral: true });
                } catch (error) {
                    console.error('Erreur lors de la fermeture du ticket :', error);
                    await interaction.reply({
                        content: 'Une erreur est survenue lors de la fermeture du ticket.',
                        ephemeral: true,
                    });
                }
            }

            if (interaction.customId === 'archive_ticket') {
                try {
                    const ticketChannel = interaction.channel;
                    const archiveCategoryId = config.archiveCategoryID;
                    const archiveCategory = interaction.guild.channels.cache.get(archiveCategoryId);
            
                    if (!archiveCategory) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'La catégorie d\'archivage est introuvable.', ephemeral: true });
                        }
                        return;
                    }
            
                    await ticketChannel.setParent(archiveCategoryId);
            
                    const logsDataDirectory = path.resolve(__dirname, '../../logs/tickets/data');
                    const logsDirectory = path.resolve(__dirname, '../../logs/tickets/logs');
                    const ticketDataFile = path.join(logsDataDirectory, `${ticketChannel.name}.json`);
                    
                    // Créer un fichier de log si nécessaire
                    const logFilePath = path.join(logsDirectory, `${ticketChannel.name}.log`);
                    let logContent = `Archivage du Ticket: ${ticketChannel.name}\n`;
                
                    // Ajouter les messages du ticket au fichier de log
                    const messages = await ticketChannel.messages.fetch({ limit: 100 }); // Récupérer les 100 derniers messages
                    messages.forEach(message => {
                        logContent += `[${message.author.tag}] : ${message.content}\n`;
                    });
                
                    // Enregistrer le log dans un fichier
                    fs.writeFileSync(logFilePath, logContent);
                
                    // Enregistrement direct des données sans demander la raison
                    const ticketData = {
                        staff: 'Aucun staff assigné', // Valeur par défaut
                        member: ticketChannel.topic?.replace('Ticket créé par ', '') || 'Inconnu',
                        date: new Date().toLocaleString('fr-FR', {
                            timeZone: 'Europe/Paris',
                            hour12: false,
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),
                    };
            
                    // Écrire dans le fichier .json
                    fs.writeFileSync(ticketDataFile, JSON.stringify(ticketData, null, 2));
            
                    // Envoi de l'embed d'archivage
                    const archiveEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle(`Archivage du Ticket : ${ticketChannel.name}`)
                        .setDescription('Voici les informations principales du ticket archivé :')
                        .addFields(
                            { name: 'Membre', value: ticketData.member, inline: true },
                            { name: 'Staff', value: ticketData.staff, inline: true },
                            { name: 'Date', value: ticketData.date, inline: true },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Ticket archivé', iconURL: interaction.guild.iconURL() });
            
                    const archiveChannel = interaction.guild.channels.cache.get(config.archiveChannelID);
                    if (!archiveChannel) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'Le salon d\'archivage est introuvable.', ephemeral: true });
                        }
                        return;
                    }
            
                    await archiveChannel.send({ embeds: [archiveEmbed] });
            
                    // Vérifier si le fichier de log existe
                    const logFile = path.join(logsDirectory, `${ticketChannel.name}.log`);
                    if (fs.existsSync(logFile)) {
                        // Envoyer le fichier log en tant qu'attachement
                        const logAttachment = new AttachmentBuilder(logFile);
                        await archiveChannel.send({ files: [logAttachment] });
                    } else {
                        console.error('Le fichier de log n\'existe pas.');
                        if (!interaction.replied) {
                            await interaction.reply({
                                content: 'Une erreur est survenue : le fichier de log est introuvable.',
                                ephemeral: true,
                            });
                        }
                    }
            
                    // Vérifie si une réponse a déjà été envoyée avant de répondre.
                    if (!interaction.replied) {
                        await interaction.reply({ content: 'Le ticket a été archivé avec succès.', ephemeral: true });
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'archivage du ticket :', error);
                    // Réponse seulement si aucune réponse n'a été envoyée.
                    if (!interaction.replied) {
                        await interaction.reply({
                            content: 'Une erreur est survenue lors de l\'archivage du ticket.',
                            ephemeral: true,
                        });
                    }
                }
            }
            


            if (interaction.customId === 'delete_ticket') {
                try {
                    const ticketChannel = interaction.channel;

                    await interaction.reply({ content: 'Le ticket a été supprimé.', ephemeral: true });

                    await ticketChannel.delete();
                } catch (error) {
                    console.error('Erreur lors de la suppression du ticket :', error);
                    if (!interaction.replied) {
                        await interaction.reply({
                            content: 'Une erreur est survenue lors de la suppression du ticket.',
                            ephemeral: true,
                        });
                    }
                }
            }
        });
    }
};
