const { Command } = require('sheweny');
const { MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = class SetTicketMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-ticket-message',
      description: 'Configure le message pour créer un ticket',
      type: 'SLASH_COMMAND',
      category: 'Admin',
      userPermissions: ['ADMINISTRATOR'],
    });
  }

  async execute(interaction) {
    const ticketButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('create_ticket')
          .setLabel('Créer un ticket')
          .setStyle('PRIMARY')
      );

    const embed = new MessageEmbed()
      .setTitle('Contactez le staff')
      .setDescription('Cliquez sur le bouton ci-dessous pour créer un ticket et décrire votre besoin.')
      .setColor('PURPLE');

    await interaction.reply({ embeds: [embed], components: [ticketButton] });
  }
};
