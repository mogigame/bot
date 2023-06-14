const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "recharge",
      description: "Obtenir des armes",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3600,
    });
  }

  async execute(interaction) {
    const randomWeapon = [
        "1009504316744290435", // epee
    ]
    
    const randomWeaponChoice = Math.floor(Math.random() * randomWeapon.length)
    interaction.member.roles.add(randomWeapon[randomWeaponChoice])
    interaction.reply({
        content: "Une arme vous a été donner! attaquez l'équipe ennemie en appuyant sur le bouton attaquer dans <#1009491595122442272>",
        ephemeral: true
    })
  }
};

