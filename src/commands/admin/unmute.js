const { Command } = require("sheweny");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Permet à quelqu'un de parler à nouveau",
      type: 'SLASH_COMMAND',
      category: "admin",
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.ModerateMembers],
      options: [
        {
          name: "cible",
          description: "Quelqu'un sur terre",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "raison",
          description: "Raison de l'unmute",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const cible = interaction.options.getMember('cible');
    const raison = interaction.options.getString('raison');

    if (!cible) {
      return interaction.reply({ content: "Mentionnez un utilisateur valide.", ephemeral: true });
    }

    if (!raison) {
      return interaction.reply({ content: "Veuillez fournir une raison pour l'unmute.", ephemeral: true });
    }

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: "Tu n'as pas la permission pour exécuter cette commande !",
        ephemeral: true,
      });
    }

    try {
      const mutedRole = interaction.guild.roles.cache.find(role => role.name === "MUTE");

      if (!mutedRole) {
        return interaction.reply({ content: "Le rôle 'mute' n'existe pas sur ce serveur.", ephemeral: true });
      }

      await cible.roles.remove(mutedRole);
      return interaction.reply({
        content: `${cible.user.tag} a été unmute. Raison : ${raison}`,
      });

    } catch (error) {
      console.error(`Erreur lors de l'unmute de ${cible.user.tag} : ${error.message}`);
      return interaction.reply({ content: `Impossible d'unmute ${cible.user.tag}.`, ephemeral: true });
    }
  }
};
