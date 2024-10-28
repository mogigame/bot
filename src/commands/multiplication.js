const { Command } = require("sheweny");

module.exports = class MultiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "multiplication",
            description: "Multiplie tes nombres",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 1,
            options: [
                {
                    name: "nombre1",
                    description: "Premier nombre",
                    type: "NUMBER",
                    required: true,
                },
                {
                    name: "nombre2",
                    description: "Deuxième nombre",
                    type: "NUMBER",
                    required: true,
                },
                {
                    name: "nombre3",
                    description: "Troisième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre4",
                    description: "Quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre5",
                    description: "Cinquième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre6",
                    description: "Sixième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre7",
                    description: "Septième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre8",
                    description: "Huitième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre9",
                    description: "Neuvième nombre",
                    type: "NUMBER",
                },
            ],
        });
    }

    async execute(interaction) {
        let numbers = [];
        for (let i = 1; i <= 9; i++) {
            const num = interaction.options.getNumber(`nombre${i}`);
            if (num !== null) numbers.push(num);
        }

        const result = numbers.reduce((acc, num) => acc * num, 1);

        const numbersStr = numbers.join(" × ");
        interaction.reply({
            content: `**${numbersStr}** est égale à **${result}**`, ephemeral: true,
        });
    }
};
