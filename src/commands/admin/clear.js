const { Command } = require("sheweny");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "Supprime un nombre de messages",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "nombre",
          description: "Combien de messages veux-tu supprimer ?",
          type: "NUMBER",
          required: true,
        }
      ],
    });
  }

  async execute(interaction) {
    const nombre = interaction.options.getNumber('nombre');
    
    const limit = Math.min(nombre, 100);

    if (interaction.member.permissions.has('ADMINISTRATOR')) {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: limit });
        
        const recentMessages = messages.filter(msg => {
          return (Date.now() - msg.createdTimestamp) < (14 * 24 * 60 * 60 * 1000);
        });

        await interaction.channel.bulkDelete(recentMessages);

        setTimeout(async () => {
          if (recentMessages.size <= 0) {
            await interaction.reply({
              content: "aucun message n'a été supprimé car ils sont trop anciens.", ephemeral: true ,
            });
          }
          else{
          await interaction.reply({
            content: `${recentMessages.size} messages ont été supprimés.`, ephemeral: true ,
          });
        }
        }, 500);

      } catch (error) {
        console.error('Erreur lors de la suppression des messages :', error);
        await interaction.reply({
          content: `Je n'ai pas réussi à supprimer ${nombre} messages :(`, ephemeral: true ,
        });
      }
    } else {
      await interaction.reply({
        content: "Tu n'as pas la permission de supprimer des messages.", ephemeral: true ,
      });
    }
  }
};
