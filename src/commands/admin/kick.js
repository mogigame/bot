const { Command } = require("sheweny");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Kick un utilisateur du serveur",
      type: 'SLASH_COMMAND',
      category: "Admin",
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.KickMembers],
      options: [
        {
          name: "cible",
          description: "Qui voulez-vous kicker ?",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "raison",
          description: "Raison du kick",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const target = interaction.options.getUser("cible");
    const raison = interaction.options.getString("raison");
    const member = await interaction.guild.members.fetch(target.id);

    try {
      await member.kick(raison);
      await interaction.reply({
        content: `${target.tag} a été kické avec succès pour la raison : ${raison}.`,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `❌ Je n'ai pas réussi à kicker ${target.tag}.`,
      });
    }

  }
};
