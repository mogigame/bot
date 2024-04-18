const { Command } = require("sheweny");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Plus parler",
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
          name: "temps",
          description: "Le temps que tu veux",
          type: "NUMBER",
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
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const cible = interaction.options.getMember('cible');
    const temps = interaction.options.getNumber('temps');
    const raison = interaction.options.getString('raison');
    let mutedRole = interaction.guild.roles.cache.find(role => role.name === "MUTE");

    if (!mutedRole) {
      try {
        // Si le rôle 'mute' n'existe pas, créez-le
        mutedRole = await interaction.guild.roles.create({
          name: "MUTE",
          color: "GREY",
          mentionable: false,
          hoist: false,
          permissions: [],
        });
      } catch (error) {
        console.error(`Erreur lors de la création du rôle 'MUTE': ${error.message}`);
        return interaction.reply({ content: "Impossible de créer le rôle 'mute'.", ephemeral: true });
      }
    }

    if (interaction.member.permissions.has('ADMINISTRATOR')) {
      try {
        // Donne le rôle mute à la cible
        await cible.roles.add(mutedRole);
        interaction.reply({
          content: `${cible.user.tag} a été muté. Raison : ${raison}`,
        });

        // Utilise setTimeout pour retirer le rôle après le délai spécifié
        setTimeout(async () => {
          await cible.roles.remove(mutedRole);
        }, temps * 24 * 60 * 60 * 1000);
      } catch (error) {
        console.error(`Impossible de muter ${cible.user.tag} : ${error.message}`);
        interaction.reply({ content: `Impossible de muter ${cible.user.tag}`, ephemeral: true });
      }
    } else {
      interaction.reply({
        content: "Tu n'as pas la permission pour exécuter cette commande !",
        ephemeral: true,
      });
    }
  }
};
