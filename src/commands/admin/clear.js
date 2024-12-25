const { Command } = require('sheweny');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      description: 'Supprime un certain nombre de messages dans le salon actuel.',
      type: 'SLASH_COMMAND',
      category: 'Admin',
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
      options: [
        {
          name: 'nombre',
          description: 'Le nombre de messages à supprimer (1-100).',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const nombre = interaction.options.getInteger('nombre');

    if (nombre < 1 || nombre > 100) {
      return interaction.editReply({
        content: "❌ Veuillez fournir un nombre entre 1 et 100.",
      });
    }
    
    try {
      const messages = await interaction.channel.bulkDelete(nombre, true);
      return interaction.editReply({
        content: `✅ ${messages.size} message(s) supprimé(s) avec succès.`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "❌ Une erreur est survenue lors de la suppression des messages.",
      });
    }
  }
};
