const { Command } = require("sheweny");

module.exports = class EventCommand extends Command {
  constructor(client) {
    super(client, {
      name: "event",
      description: "commande pour les event",
      type: "SLASH_COMMAND",
      category: "Misc",
    });
  }

  async execute(interaction) {
        interaction.reply({
        content: "Le prochain évent sera le **samedi 8 avril** à **16h** sur minecraft, on ferra un **__hide and seak__** alias __cache cache__"});
        console.log("l'event loup garoux va commencer")
        
  }}
