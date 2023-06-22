const { Command } = require("sheweny");

module.exports = class ReportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "report",
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


        if (!user) {
            return interaction.reply("Vous devez mentionner un utilisateur à avertir.");
          }
            interaction.reply(`\`\`\`Vous avez report ${user} succès. 
                              \nLe staff vérifiera vos report.\`\`\`
                              \n Raison du report : **${reason}**`);
            }
        };