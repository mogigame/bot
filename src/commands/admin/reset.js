const { Command } = require("sheweny");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "reset",
      description: "Remettre à 0 les points",
      type: "MESSAGE_COMMAND",
      cooldown: 3,
    });
  }

  async execute(interaction) {
    if (interaction.member.permissions.has("ADMINISTRATOR") ||interaction.member.roles.cache.has("829287933927489568")) {
      let startringPoints = 0;

      const tournoiEmbedAlpha = new MessageEmbed()
        .setAuthor({
          name: "Equipe Alpha",
        })
        .setColor("BLUE")
        .setTitle("Point de l'équipe Alpha")
        .setDescription(`\`\`\`diff\n${startringPoints}\n\`\`\``)
        .setThumbnail(
          "https://emojipedia-us.s3.amazonaws.com/source/skype/289/crossed-swords_2694-fe0f.png"
        )
        .setTimestamp()
        .setFooter({
          text: "Equipe Alpha",
        });

      const tournoiEmbedOmega = new MessageEmbed()
        .setAuthor({
          name: "Equipe Omega",
        })
        .setColor("NOT_QUITE_BLACK")
        .setTitle("Points de l'équipe Omega")
        .setDescription(`${startringPoints}`)
        .setThumbnail(
          "https://emojipedia-us.s3.amazonaws.com/source/skype/289/crossed-swords_2694-fe0f.png"
        )
        .setTimestamp()
        .setFooter({
          text: "Equipe Omega",
        });

      const attackBtns = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("alpha_omega")
          .setDisabled(false)
          .setLabel("Attaquer l'équipe OMEGA")
          .setStyle("SECONDARY"),

        new MessageButton()
          .setCustomId("omega_alpha")
          .setDisabled(false)
          .setLabel("Attaquer l'équipe ALPHA")
          .setStyle("SECONDARY")
      );

      this.client.guilds.cache
        .get("754657793704722473")
        .channels.cache.get("1009491595122442272")
        .send({
          embeds: [tournoiEmbedAlpha, tournoiEmbedOmega],
          components: [attackBtns],
        });

      const joinTeamEmbed = new MessageEmbed()
        .setAuthor({
          name: `${interaction.guild.name}`,
          iconURL: `${interaction.guild.iconURL()}`,
        })
        .setColor("RED")
        .setDescription("Rejoignez une équipe dès maintenant")
        .setTimestamp()
        .setFooter({
          text: "Si un bouton est désactivé, c'est pour équilibré les membres de chaque équipe",
        });

      const joinTeambtns = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("joinAlpha")
          .setDisabled(false)
          .setLabel("Rejoindre l'équipe ALPHA")
          .setStyle("SUCCESS"),

        new MessageButton()
          .setCustomId("joinOmega")
          .setDisabled(false)
          .setLabel("Rejoindre l'équipe OMEGA")
          .setStyle("SUCCESS")
      );
      this.client.guilds.cache
        .get("754657793704722473")
        .channels.cache.get("1009494854377668668")
        .send({
          embeds: [joinTeamEmbed],
          components: [joinTeambtns],
        });
    }
  }
};
