const { Command } = require("sheweny");

module.exports = class kickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "kick",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
            name: "cible",
            description: "Qui voulez vous kick ?",
            type: "USER",
            required: true,
        },{
            name : "raison",
            description: "raison du kick",
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
            member.ban({
                reason: [`${raison}`]
            })
            interaction.reply({
                content: `${target} a été kick`
            })
        } catch (error) {
            interaction.reply({
                content: `Je n'ai pas reussi à kick ${target}`
            })
        }

    } else {
        interaction.reply({
            content: "T'as pas la perm c'est domage"
        })
    }
  }
};

