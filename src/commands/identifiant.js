const { Command } = require("sheweny");
const { MessageEmbed } = require('discord.js');

module.exports = class IdentifiantCommand extends Command {
  constructor(client) {
    super(client, {
      name: "identifiant",
      description: "Commande qui donne l'identifiant d'un membre",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "cible",
          description: "Quel utilisateur souhaitez-vous récupérer l'identifiant ?",
          type: "USER",
          required: true,
        }
      ]
    });
  }

  async execute(interaction) {
    try {
      const target = interaction.options.getUser('cible');
      if (!target) {
        return interaction.reply("Utilisateur non trouvé.");
      }

      const embed = new MessageEmbed()
        .setColor('#d99241')
        .addFields(
          { name: `L'identifiant de ${target.tag} est :`, value: `${target.id}`, }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande:", error);
      await interaction.reply("Une erreur est survenue lors de l'exécution de la commande.");
    }
  }
};
