const { Command } = require('sheweny');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

async function hasOpenTicket(interaction) {
  const openCategoryID = config.openCategoryID;
  const existingChannels = interaction.guild.channels.cache.filter(channel =>
    channel.parentId === openCategoryID &&
    channel.permissionOverwrites.cache.has(interaction.user.id)
  );
  return existingChannels.size > 0;
}

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
    if (await hasOpenTicket(interaction)) {
      return interaction.reply({ content: "Vous avez déjà un ticket ouvert.", ephemeral: true });
    }

    await interaction.deferReply(); 
    try {
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
          { id: interaction.guild.id, deny: ['VIEW_CHANNEL'] },
          { id: interaction.user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] },
        ],
      });

      const embedTicket = new MessageEmbed()
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

      const message = await ticketChannel.send({ embeds: [embedTicket], components: [closeButton] });

      await interaction.editReply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });

      const closeFilter = (i) => i.customId === 'close_ticket' && i.user.id === interaction.user.id;
      const closeCollector = message.createMessageComponentCollector({ filter: closeFilter, time: 86400000 });

      closeCollector.on('collect', async (btnInteraction) => {
        await ticketChannel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: false });
        await ticketChannel.setParent(closeCategoryID);

        const closeEmbed = new MessageEmbed()
          .setTitle('Ticket fermé')
          .setDescription('Le ticket est désormais fermé. Choisissez une option pour le gérer.\nRaison du ticket :' + raison)
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
        await message.edit({ embeds: [closeEmbed], components: [closeActions] });
        await btnInteraction.reply({ content: 'Le ticket a été fermé. Vous pouvez l\'archiver ou le supprimer.', ephemeral: true });

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
      });
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      interaction.reply({ content: "Une erreur est survenue lors de la création du ticket.", ephemeral: true });
    }
  }
};
