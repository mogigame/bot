const { Command } = require('sheweny');
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'te donne la liste des commandes disponibles',
      type: 'SLASH_COMMAND',
      category: 'Misc',
      cooldown: 3,
      options: [
        {
          name: 'type',
          description: 'Le type de commandes à afficher',
          type: 'STRING',
          required: false,
          choices: [
            {
              name: 'membre',
              value: 'membre',
            },
            {
              name: 'staff',
              value: 'staff',
            },
          ],
        },
      ],
    });
  }

  async execute(interaction) {
    const type = interaction.options.getString('type');
    const embed = new MessageEmbed()

    switch (type) {
      case 'membre':
        embed.setColor('#0099ff')
        embed.addFields(
          { name: 'Commandes pour les membres', value: 'Liste des commandes pour les membres' },
          { name: '/event', value: 'Dit les prochain évent à venir', inline: true },
          { name: '/message', value: 'Envois un message en anonyme', inline: true },
          { name: '/multiplication', value: 'Fait une multiplication', inline: true },
          { name: '\u200B', value: '\u200B' },
        );
        embed.addFields(
          { name: '/nombre', value: 'Donne un nombre aléatoire entre 1 et x', inline: true },
          { name: '/pythagore', value: 'Fait le théorème de Pythagore', inline: true },
          { name: '/reciproque', value: 'Fait la réciproque du théorème de Pythagore', inline: true },
          { name: '\u200B', value: '\u200B' },
        );
        embed.addFields(
          { name: 'report', value: 'Permet de signaler un utilisateur', inline: true },
          { name: 'type', value: 'Permet de donner le type de caractère (string, number ou boolean)', inline: true },
        );
        break;
      case 'staff':
        embed.setColor('#f70c37')
        embed.addField('Commandes pour le staff', 'Liste des commandes pour le staff');
        break;
      default:
        embed.addField('Commandes pour les membres', '/help membre')
            .addField('Commandes pour le staff', '/help staff');
        break;
    }

    await interaction.reply({ embeds: [embed] });
  }
};
