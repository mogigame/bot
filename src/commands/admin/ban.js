const { Command } = require('sheweny');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Bannir un membre du serveur.',
      type: 'SLASH_COMMAND',
      category: 'Admin',
      userPermissions: [PermissionsBitField.Flags.BanMembers],
      options: [
        {
          name: 'membre',
          description: 'Le membre à bannir.',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison du bannissement.',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    await interaction.deferReply();

    const membre = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison spécifiée.';

    if (!membre) {
      return interaction.editReply({
        content: "Je n'ai pas pu trouver cet utilisateur ou il n'est pas sur ce serveur.",
      });
    }

    if (!membre.bannable) {
      return interaction.editReply({
        content: "Je ne peux pas bannir cet utilisateur. Vérifiez mes permissions ou le rôle de l'utilisateur.",
      });
    }

    try {
      await membre.ban({ reason: raison });
      return interaction.editReply({
        content: `✅ ${membre.user.tag} a été banni avec succès.\nRaison : ${raison}`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "Une erreur est survenue lors du bannissement de cet utilisateur.",
      });
    }
  }
};
