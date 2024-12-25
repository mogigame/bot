const { Command } = require('sheweny');
const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class SetMemberRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set_member_role',
      description: 'Définit un rôle pour les membres',
      type: 'SLASH_COMMAND',
      category: 'Misc',
      cooldown: 3,
      userPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
          name: 'role',
          description: 'Rôle à définir pour les membres',
          type: ApplicationCommandOptionType.Role,
          required: true,
        }
      ],
    });
  }

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const configPath = path.resolve(__dirname, '../../../config.json');
    let config = {};

    try {
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } else {
        config = { memberRoleID: null };
      }

      if (role.id === config.memberRoleID) {
        return interaction.reply({ content: `Le rôle membre est déjà défini avec l'ID : ${role.id}`, ephemeral: true });
      }

      config.memberRoleID = role.id;

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

      return interaction.reply({ content: `Le rôle membre a été mis à jour avec l'ID : ${role.id}`, ephemeral: true });

    } catch (error) {
      console.error(`Erreur lors de la lecture/écriture du fichier de configuration : ${error.message}`);
      return interaction.reply({ content: 'Une erreur est survenue lors de la mise à jour du rôle membre.', ephemeral: true });
    }
  }
};
