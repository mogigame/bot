const { Command } = require('sheweny');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = class TicketCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ticket',
      description: 'Créer un ticket',
      type: 'SLASH_COMMAND',
      category: 'Misc',
      cooldown: 3,
      options: [
        {
          name: 'raison',
          description: 'Raison du ticket',
          type: 'STRING',
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const raison = interaction.options.getString('raison');
    const openCategoryID = config.openCategoryID;
    const closeCategoryID = config.closeCategoryID;
    const archiveCategoryID = config.archiveCategoryID;
    const logChannelID = config.logChannelID;
    const logDir = path.resolve(__dirname, '../log/ticket');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
      type: 'GUILD_TEXT',
      parent: openCategoryID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.user.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        },
      ],
    });

    const embed = new MessageEmbed()
      .setTitle('Ticket')
      .setDescription(`Bienvenue dans votre ticket. Veuillez décrire votre problème.\nRaison : ${raison}`)
      .setColor('BLUE');

    const closeButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('close_ticket')
          .setLabel('Fermer le ticket')
          .setStyle('DANGER')
      );

    const message = await ticketChannel.send({ embeds: [embed], components: [closeButton] });

    const filter = (interaction) => interaction.customId === 'close_ticket' && interaction.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 86400000 });

    collector.on('collect', async (btnInteraction) => {
      try {
        if (!ticketChannel || !ticketChannel.isText()) return;

        await ticketChannel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: false });
        await ticketChannel.setParent(closeCategoryID);

        const closeEmbed = new MessageEmbed()
          .setTitle('Ticket fermé')
          .setDescription('Le ticket est désormais fermé. Choisissez une option pour le gérer.')
          .setColor('RED');

        const closeActions = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('archive_ticket')
              .setLabel('Archiver le ticket')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('delete_ticket')
              .setLabel('Supprimer le ticket')
              .setStyle('DANGER')
          );

        closeButton.components[0].setDisabled(true);

        if (message && message.editable) {
          await message.edit({ embeds: [closeEmbed], components: [closeActions] });
        } else {
          console.error("Impossible d'éditer le message pour ajouter les boutons d'archive et de suppression.");
        }

        await btnInteraction.reply({ content: 'Le ticket a été fermé. Vous pouvez l\'archiver ou le supprimer.', ephemeral: true });
        collector.stop();

        const archiveDeleteCollector = ticketChannel.createMessageComponentCollector({ time: 86400000 });

        archiveDeleteCollector.on('collect', async (actionInteraction) => {
          try {
            if (actionInteraction.customId === 'archive_ticket') {
              const messages = await ticketChannel.messages.fetch({ limit: 100 });
              const logContent = messages
                .reverse()
                .map(msg => {
                  const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Paris' };
                  const dateFormatter = new Intl.DateTimeFormat('fr-FR', dateOptions);
                  const formattedDate = dateFormatter.format(msg.createdAt);
                  return `[${formattedDate}] ${msg.author.tag}: ${msg.content}`;
                })
                .join('\n');

              const logFilePath = path.join(logDir, `ticket-${interaction.user.username}-${raison}.log`);
              fs.writeFileSync(logFilePath, logContent);

              const logChannel = interaction.guild.channels.cache.get(logChannelID);
              if (logChannel) {
                await logChannel.send({
                  content: `Archive du ticket de ${interaction.user.tag}`,
                  files: [logFilePath],
                });
              }

              await ticketChannel.setParent(archiveCategoryID);
              await actionInteraction.reply({ content: 'Le ticket a été archivé.', ephemeral: true });
            } else if (actionInteraction.customId === 'delete_ticket') {
              await actionInteraction.reply({ content: 'Le ticket va être supprimé.', ephemeral: true });
              await ticketChannel.delete();
            }
          } catch (error) {
            console.error("Erreur lors de l'archivage ou suppression du ticket:", error);
          }
        });
      } catch (error) {
        console.error("Erreur lors de la collecte des interactions de fermeture:", error);
      }
    });
  }
}    