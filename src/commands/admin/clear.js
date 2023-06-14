const { Command } = require("sheweny");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "retire un nombre de message",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
          name: "nombre",
          description: "combien de message veut-tu suprimé ?",
          type: "NUMBER",
        }
      ]
      },
    );
  }



  async execute(interaction) {
    const nombre = interaction.options.getNumber('nombre');
    if(interaction.member.permissions.has('ADMINISTRATOR')) {
      try {
        interaction.channel.bulkDelete(nombre)
        setTimeout(async() => {
          await interaction.reply({
            content: `${nombre} messages ont été supprimées`
          })
        }, 500);
        

      } catch (error) {
        interaction.reply({
          content: `Je n'ai pas réussi à supp ${nombre} mesages :(`
        })
      }
    }
    }
};