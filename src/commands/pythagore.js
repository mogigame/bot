const { Command } = require("sheweny");

module.exports = class PythaCommand extends Command {
  constructor(client) {
    super(client, {
      name: "pythagore",
      description: "fait le pythagore automatiquement",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
            name: "hauteur",
            description: "met la hauteur de ton triangle rectangle",
            type: "NUMBER",
            required: true
        },
        {
            name: "largeur",
            description: "met la largeur de ton triangle rectangle",
            type: "NUMBER",
            required: true
        },
    ],
    });
  }

  async execute(interaction) {
  let hauteur = interaction.options.getNumber('hauteur');
  let largeur = interaction.options.getNumber('largeur');


      const hypothenuse = Math.sqrt(Math.pow(hauteur, 2)+Math.pow(largeur, 2));
      interaction.reply({
        content: `l'hypothénus meusure ${hypothenuse}cm`
      })
  
}
};