const { Command } = require("sheweny");

module.exports = class ReciproqueCommand extends Command {
  constructor(client) {
    super(client, {
      name: "reciproque",
      description: "fait la réciproque du théorème de pythagore automatiquement",
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
        {
            name: "hypothenus",
            description: "met l'hypothénus du triangle",
            type: "NUMBER",
            required: true
        },
    ],
    });
  }

  async execute(interaction) {
  let hauteur = interaction.options.getNumber('hauteur');
  let largeur = interaction.options.getNumber('largeur');
  let hypothenus = interaction.options.getNumber('hypothenus');


  if((Math.pow(hauteur, 2) + Math.pow(largeur, 2)) === Math.pow(hypothenus, 2)) {
    interaction.reply({
        content: `le triangle est rectangle`,
      });
    }
    
    else {
    interaction.reply({
        content: `le triangle n'est pas rectangle`,
      });
}
}
};