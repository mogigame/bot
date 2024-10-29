const { Command } = require("sheweny");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      description: "ban",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 3,
      options: [
        {
            name: "cible",
            description: "Qui voulez vous ban ?",
            type: "USER",
            required: true,
        },{
            name : "raison",
            description: "raison du ban",
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

    if(interaction.member.permissions.has('BAN_MEMBERS')) {
        try {
            member.ban({
                reason: [`${raison}`]
            })
            interaction.reply({
                content: `${target} a été bannie`
            })
        } catch (error) {
            interaction.reply({
                content: `Je n'ai pas reussi à ban ${target}`
            })
        }

    } else {
        interaction.reply({
            content: "T'as pas la perm c'est domage"
        })
    }
  }
};

