const { Command } = require("sheweny");

module.exports = class TypeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "type",
            description: "dit si le mot est un sting/chiffre/boolean...",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 1,
            options: [
                {
                    name: "boolean",
                    description: "met un boolean",
                    type: "BOOLEAN",
                    required: false
                },
                {
                    name: "mot",
                    description: "choisit un mot/chiffre/boolean... ",
                    type: "STRING",
                    required: false
                },
                {
                    name: "number",
                    description: "met un nombre",
                    type: "NUMBER",
                    required: false
                }
            ],
        });
    }


    async execute(interaction) {

        let word = interaction.options.getString('mot');
        let nombre = interaction.options.getNumber('number');
        let TrueFalse = interaction.options.getBoolean('boolean');


        if (typeof word === "string"){
            interaction.reply({
         content: `*${word}* est un **${typeof word}**` }
            )}

            else if (typeof nombre === "number")
            {
                interaction.reply({
             content: `*${nombre}* est un **${typeof nombre}**` }
                )}
                
                else if (typeof TrueFalse === "boolean")
                {
                    interaction.reply({
                 content: `*${TrueFalse}* est un **${typeof TrueFalse}**` }
                    )}
}
};

