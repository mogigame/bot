const { Button } = require("sheweny");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = class ButtonTest extends Button {
  constructor(client) {
    super(client, ["primaryId", "secondaryId", "successId", "dangerId", "joinAlpha", "joinOmega", "alpha_omega"]);
  }
  
  async execute(button) {
    switch (button.customId) {
      case "primaryId":
        await button.reply({ content: "You have clicked on **primary** button !" });
        break;
      case "secondaryId":
        await button.reply({ content: "You have clicked on **secondary** button !" });
        break;
      case "successId":
        await button.reply({ content: "You have clicked on **success** button !" });
        break;
      case "dangerId":
        await button.reply({ content: "You have clicked on **danger** button !" });
        break;
      case "joinAlpha":
          if(!button.member.roles.cache.has('1009496250757947402')) {
            const joinAlpheEmbedTeam = new MessageEmbed()
              .setAuthor({
                name: `${button.user.username}`,
                iconURL: `${button.member.displayAvatarURL()}`
              })
              .setColor('RANDOM')
              .setDescription(`${button.user.username} a rejoint l'équipe!`)
              .setThumbnail(`${button.member.displayAvatarURL()}`)
              .setTimestamp()
              .setFooter({
                text: "Equipe ALPHA"
              })

            this.client.channels.cache.get('1009496411643072573').send({
              embeds: [joinAlpheEmbedTeam]
            })

            const joinTeamEditedEmbed = new MessageEmbed()
                .setAuthor({
                  name: `${button.guild.name}`,
                  iconURL: `${button.guild.iconURL()}`
              })
              .setColor('RED')
              .setDescription("Rejoignez une équipe dès maintenant")
              .setTimestamp()
              .setFooter({
                  text: "Si un bouton est désactivé, c'est pour équilibré les membres de chaque équipe",
              })
  
            const joinTeambtns = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('joinAlpha')
                    .setDisabled(true)
                    .setLabel("Rejoindre l'équipe ALPHA")
                    .setStyle('DANGER'),
        
                new MessageButton()
                    .setCustomId('joinOmega')
                    .setDisabled(false)
                    .setLabel("Rejoindre l'équipe OMEGA")
                    .setStyle('SUCCESS')
            )
              button.member.roles.add('1009496256709668947')
              button.reply({
                content: "Vous êtes maintenant dans l'équipe ALPHA, votre salon est => <#1009496411643072573>",
                ephemeral: true
              })
            button.message.edit({
              embeds: [joinTeamEditedEmbed],
              components: [joinTeambtns]
            })
          } else {
            button.reply({
              content: "Vous ne pouvez pas rejoindre les deux équipes!",
              ephemeral: true
            })
          }
        break;
      case "joinOmega":
        if(!button.member.roles.cache.has('1009496256709668947')) {
          const joinAlpheEmbedTeam = new MessageEmbed()
              .setAuthor({
                name: `${button.user.username}`,
                iconURL: `${button.member.displayAvatarURL()}`
              })
              .setColor('RANDOM')
              .setDescription(`${button.user.username} a rejoint l'équipe!`)
              .setThumbnail(`${button.member.displayAvatarURL()}`)
              .setTimestamp()
              .setFooter({
                text: "Equipe ALPHA"
              })

            this.client.channels.cache.get('1009496445902147697').send({
              embeds: [joinAlpheEmbedTeam]
            })


          const joinTeamEditedEmbed = new MessageEmbed()
              .setAuthor({
                name: `${button.guild.name}`,
                iconURL: `${button.guild.iconURL()}`
            })
            .setColor('RED')
            .setDescription("Rejoignez une équipe dès maintenant")
            .setTimestamp()
            .setFooter({
                text: "Si un bouton est désactivé, c'est pour équilibré les membres de chaque équipe",
            })

          const joinTeambtns = new MessageActionRow().addComponents(
              new MessageButton()
                  .setCustomId('joinAlpha')
                  .setDisabled(false)
                  .setLabel("Rejoindre l'équipe ALPHA")
                  .setStyle('SUCCESS'),
      
              new MessageButton()
                  .setCustomId('joinOmega')
                  .setDisabled(true)
                  .setLabel("Rejoindre l'équipe OMEGA")
                  .setStyle('DANGER')
          )
            button.member.roles.add('1009496250757947402')
            button.reply({
              content: "Vous êtes maintenant dans l'équipe ALPHA, votre salon est => <#1009496411643072573>",
              ephemeral: true
            })
          button.message.edit({
            embeds: [joinTeamEditedEmbed],
            components: [joinTeambtns]
          })
        } else {
          button.reply({
            content: "Vous ne pouvez pas rejoindre les deux équipes!",
            ephemeral: true
          })
        }
        break;
      case "alpha_omega":
          if(!button.member.roles.cache.has('1009496250757947402')) { // omega
            if(button.member.roles.cache.has('1009504316744290435')) { // epee
              let amount = Math.floor(Math.random() * 3000)
              const newEmbed = new MessageEmbed()
                  .setAuthor({
                    name: "Equipe Alpha",
                  })
                  .setColor('BLUE')
                  .setTitle("Point de l'équipe Alpha")
                  .setDescription(`${parseInt(button.message.embeds[0]?.description) + amount}`)
                  .setThumbnail('https://emojipedia-us.s3.amazonaws.com/source/skype/289/crossed-swords_2694-fe0f.png')
                  .setTimestamp()
                  .setFooter({
                      text: "Equipe Alpha"
                  })

                const newEmbed2 = new MessageEmbed()
                  .setAuthor({
                    name: "Equipe Alpha",
                  })
                  .setColor('BLUE')
                  .setTitle("Point de l'équipe Alpha")
                  .setDescription(`\`\`\`diff\n${parseInt(button.message.embeds[1]?.description)}\n\`\`\``)
                  .setThumbnail('https://emojipedia-us.s3.amazonaws.com/source/skype/289/crossed-swords_2694-fe0f.png')
                  .setTimestamp()
                  .setFooter({
                      text: "Equipe Omega"
                  })
                  console.log(button.message.embeds[0]?.description);
                button.message.edit({
                  embeds: [newEmbed, newEmbed2]
                })
              }
          } else {
            interaction.reply({
              content: "Vous ne pouvez pas attaquer votre propre équipe!",
              ephemeral: true
            })
          }
        break;
      case "omega_alpha":

        break;
    }
  }
};
