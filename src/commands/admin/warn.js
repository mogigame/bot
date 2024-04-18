const { Command } = require("sheweny");

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "warn un memnbre au bout d'un certain nombre de warn il sera kick puis ban",
            type: "SLASH_COMMAND",
            category: "Misc",
            options: [
                {
                    name: "name",
                    description: "met un pseudo",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "met une raison",
                    type: "STRING",
                    required: true
                }
            ],
        });
    }


    async execute(interaction) {
        const user = interaction.options.getMember('name');
        const reason = interaction.options.getString('reason');


        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }


        if (!user) {
            return interaction.reply("Vous devez mentionner un utilisateur à avertir.");
          }
          try {
            await user.send(`Vous avez été averti dans le serveur **${interaction.guild.name}**. Au bout de 3 warn, vous subierez un mute.\n La raison est la suivante : **${reason}**`);
            interaction.reply(`L'utilisateur ${user} a été averti avec succès. \n Comme raison : **${reason}**`);
          } catch (error) {
            console.error(`Une erreur s'est produite lors de l'envoi du message d'avertissement : ${error}`);
            interaction.reply("Une erreur s'est produite lors de l'envoi du message d'avertissement.");
          }
        }
      
};