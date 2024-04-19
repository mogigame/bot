const { Command } = require("sheweny");
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class IdentifiantCommand extends Command {
  constructor(client) {
    super(client, {
      name: "identifiant",
      description: "Commande qui donne l\'identifiant d\'un membre",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "cible",
          description: "Qui voulez vous récupéré l'identifiant ?",
          type: "USER",
          required: true,
        }
      ]
    });
  }

  async execute(interaction) {

    const target = interaction.options.getUser('cible');
    const embed = new MessageEmbed()

    embed.setColor('#d99241')
    embed.addFields(
      { name: `L'identifiant de ${target.tag} est : `, value: `${target.id}` },
    );

    await interaction.reply({ embeds: [embed] });

  }
};