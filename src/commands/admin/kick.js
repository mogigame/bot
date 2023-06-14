const { Command } = require("sheweny");

module.exports = class banCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      description: "Ba nqqn",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
            name: "cible",
            description: "Qui voulez vous bannir ?",
            type: "USER",
            required: true,
        },{
            name : "raison",
            description: "raison du mute",
            type: "STRING",
            required : true
          },
      ]
    });
  }

  

  async execute(interaction) {
    const target = interaction.options.getUser('cible');
    const raison = interaction.options.getString('raison');
    const member = await interaction.guild.members.cache.get(target.id)

    if(interaction.member.permissions.has('ADMINISTRATOR')) {
        try {
            member.kick({
                reason: [`${raison}`]
            })
            interaction.reply({
                content: `${target} a été banni`
            })
        } catch (error) {
            interaction.reply({
                content: `Je n'ai pas reussi à bannir ${target}`
            })
        }

    } else {
        interaction.reply({
            content: "T'as pas la perm c'est domage"
        })
    }
  }
};

