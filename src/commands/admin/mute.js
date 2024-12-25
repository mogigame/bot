const { Command } = require("sheweny");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Empêche un utilisateur de parler pendant un temps défini.",
      type: 'SLASH_COMMAND',
      category: "Admin",
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.ModerateMembers],
      options: [
        {
          name: "cible",
          description: "Quelqu'un à mute",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "temps",
          description: "Le temps pendant lequel l'utilisateur sera mute",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          choices: [
            { name: "1 jour", value: 1 },
            { name: "2 jours", value: 2 },
            { name: "3 jours", value: 3 },
            { name: "4 jours", value: 4 },
            { name: "5 jours", value: 5 },
            { name: "6 jours", value: 6 },
            { name: "7 jours", value: 7 },
          ],
        },
        {
          name: "raison",
          description: "Raison du mute",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const cible = interaction.options.getMember("cible");
    const temps = interaction.options.getInteger("temps");
    const raison = interaction.options.getString("raison");
    let mutedRole = interaction.guild.roles.cache.find(role => role.name === "MUTE");

    if (!mutedRole) {
      try {
        mutedRole = await interaction.guild.roles.create({
          name: "MUTE",
          color: "#808080",
          mentionable: false,
          hoist: false,
          permissions: [],
        });

        console.log("Rôle 'MUTE' créé avec succès");
      } catch (error) {
        console.error(`Erreur lors de la création du rôle 'MUTE': ${error.message}`);
        return interaction.reply({ content: `Impossible de créer le rôle 'mute'. Détails de l'erreur : ${error.message}`, ephemeral: true });
      }
    }


    try {
      await cible.roles.add(mutedRole);
      await interaction.reply({
        content: `${cible.user.tag} a été muté pour ${temps} jour(s). Raison : ${raison}`,
      });

      setTimeout(async () => {
        await cible.roles.remove(mutedRole);
        console.log(`${cible.user.tag} a été unmuté après ${temps} jour(s).`);
      }, temps * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error(`Impossible de muter ${cible.user.tag} : ${error.message}`);
      await interaction.reply({ content: `Impossible de muter ${cible.user.tag}`, ephemeral: true });
    }
  }
};
