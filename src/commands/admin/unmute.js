const { Command } = require("sheweny");

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Permet à quelqu'un de parler à nouveau",
      type: "SLASH_COMMAND",
      category: "admin",
      cooldown: 3,
      options: [
        {
          name: "cible",
          description: "Quelqu'un sur terre",
          type: "USER",
          required: true,
        },
        {
          name: "raison",
          description: "Raison de l'unmute",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const cible = interaction.options.getMember('cible');

    if (!cible) {
      return interaction.reply({ content: "Mentionnez un utilisateur valide.", ephemeral: true });
    }

    try {
      await interaction.guild.roles.fetch();
      const mutedRole = interaction.guild.roles.cache.find(role => role.name === "MUTE");

      if (!mutedRole) {
        return interaction.reply({ content: "Le rôle 'mute' n'existe pas sur ce serveur.", ephemeral: true });
      }

      if (interaction.member.permissions.has('ADMINISTRATOR')) {
        try {
          await cible.roles.remove(mutedRole);
          interaction.reply({
            content: `${cible.user.tag} a été unmute. Raison : ${interaction.options.getString('raison')}`,
          });
        } catch (error) {
          console.error(`Impossible d'unmute ${cible.user.tag} : ${error.message}`);
          interaction.reply({ content: `Impossible d'unmute ${cible.user.tag}`, ephemeral: true });
        }
      } else {
        interaction.reply({
          content: "Tu n'as pas la permission pour exécuter cette commande !",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Erreur lors du rafraîchissement des rôles : ${error.message}`);
    }
  }
};
