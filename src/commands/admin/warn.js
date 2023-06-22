const { Command } = require("sheweny");

module.exports = class TypeCommand extends Command {
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
            ],
        });
    }


    async execute(interaction) {
        const user = interaction.options.getMember('name');


        // Vérifier si l'utilisateur a les permissions nécessaires pour avertir des membres
        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }


        if (!user) {
            return interaction.reply("Vous devez mentionner un utilisateur à avertir.");
          }
          try {
            await user.send(`Vous avez été averti dans le serveur ${interaction.guild.name}. Veuillez prendre en compte cet avertissement.`);
            interaction.reply(`L'utilisateur ${user.user.tag} a été averti avec succès.`);
          } catch (error) {
            console.error(`Une erreur s'est produite lors de l'envoi du message d'avertissement : ${error}`);
            interaction.reply("Une erreur s'est produite lors de l'envoi du message d'avertissement.");
          }
        }
      
};