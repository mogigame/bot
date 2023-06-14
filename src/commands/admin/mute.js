const { Command } = require("sheweny");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "plus parlé",
      type: "SLASH_COMMAND",
      category: "admin",
      cooldown: 3,
      options: [
        {
          name: "cible",
          description: "qu'eslqu'un sur terre",
          type: "USER",
          required: true,
        }, {
          name: "temps",
          description: "le temps que tu veut",
          type: "NUMBER",
          required: true,
          choices: [
            {
              name: "1 jour",
              value: 1,
            }, 
            
            {
              name: "2 jour",
              value: 2,
            }, 
            
            {
              name: "3 jour",
              value: 3,
            },

            {
              name: "4 jour",
              value: 4,
            },
            {
              name: "5 jour",
              value: 5,
            },
            {
              name: "6 jour",
              value: 6,
            },
            {
              name: "7 jour",
              value: 7,
            },
          ]
        }, {
          name : "raison",
          description: "raison du mute",
          type: "STRING",
          required : true
        },
      ] 
    });
  }

  async execute(interaction) {
    const cible = interaction.options.getMember('cible'); // Personne qui sera mute
    const temps = interaction.options.getNumber('temps'); // Temps de mute
    const mutedRole = interaction.guild.roles.cache.get("760198148668260444"); // role mute
    const raison = interaction.options.getString('raison')//id role mute ↑

    if (interaction.member.permissions.has('ADMINISTRATOR')) { // Si la personne à la perm administrateur
      if (mutedRole) { // Si le role mute existe deja sur le serveur
        try { // Essaye de...
          cible.roles.add(mutedRole.id) // Donner le role mute à la cible
          interaction.reply({ // Puis répond...
            content: `${cible} **a été muté  ** \n \`\`\` durée : ${temps} jours \n raison : ${raison}\`\`\` ` 
          })
          switch (temps) {
            case 1:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 86400000);
              break;

            case 2:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 172800000);
              break;

            case 3:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 259200000);
              break;

            case 4:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 345600000);
              break;

            case 5:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 432000000);
              break;

            case 6:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 518400000);
              break;

            case 7:
              setTimeout(async () => {
                await cible.roles.remove(mutedRole.id)
              }, 604800000);
              break;
              
            default:
              break;
          }
        } catch (error) { // Si je ne peux pas donner de role à la cible OU que je ne peux pas répondre...
          console.log(`Je n'arrive pas à muter ${cible} :(`);
          interaction.reply({ // Répondre sur le serveur
            content: `Impossible de muter ${cible}`
          })
        }
      } else {
        interaction.guild.role.create({ // Crée le role
          name: "mute", // Nom du role
          color: "GREY", // Couleur du role
          mentionable: false, // Si le role est mentionable (false pour non, true pour oui)
          hoist: false // Afficher les membres ayant ce rôle séparément des autres membres en ligne (false pour non, true pour oui) 
        })
          .then((role) => { // Puis (la variable role est égal au role mute)
            cible.member.roles.add(role)
            interaction.reply({
              content: `${cible} a été mute`
            })
          })
      }
    } else {
      interaction.reply({
        content: "T'as pas la perm, c'est domage!"
      })
    }
  }
};