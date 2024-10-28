const { Command } = require("sheweny");

module.exports = class TirageCommand extends Command {
  constructor(client) {
    super(client, {
      name: "tirage",
      description: "choisit un nombre aléatoire",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 1,
      options: [
        {
          name: "nombre",
          description: "Nombre ",
          type: "NUMBER",
          required: true
        }
      ],
    });
  }

  async execute(interaction) {

    const nombre = interaction.options.getNumber("nombre");
    const result = Math.floor(Math.random() * nombre + 1);

    await interaction.reply({
      content: `Nombre au hasard entre 1 et ${nombre} => ${result} :-)`, ephemeral: true ,
    });
    
    console.log("quelqu'un veut jouer au loto ?");
  }
};
