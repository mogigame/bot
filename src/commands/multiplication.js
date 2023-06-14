const { Command } = require("sheweny");

module.exports = class MultiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "multiplication",
            description: "multipli tes nombre",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 1,
            options: [
                {
                    name: "nombre1",
                    description: "met un premier nombre",
                    type: "NUMBER",
                    required: true,
                },
                {
                    name: "nombre2",
                    description: "met un second nombre",
                    type: "NUMBER",
                    required: true
                },
                {
                    name: "nombre3",
                    description: "met un troisième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre4",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre5",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre6",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre7",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre8",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
                {
                    name: "nombre9",
                    description: "met un quatrième nombre",
                    type: "NUMBER",
                },
            ],
        });
    }


    async execute(interaction) {
        let nombre1 = interaction.options.getNumber('nombre1');
        let nombre2 = interaction.options.getNumber('nombre2');
        let nombre3 = interaction.options.getNumber('nombre3');
        let nombre4 = interaction.options.getNumber('nombre4');
        let nombre5 = interaction.options.getNumber('nombre5');
        let nombre6 = interaction.options.getNumber('nombre6');
        let nombre7 = interaction.options.getNumber('nombre7');
        let nombre8 = interaction.options.getNumber('nombre8');
        let nombre9 = interaction.options.getNumber('nombre9');


if(nombre1, nombre2, nombre3, nombre4, nombre5, nombre6, nombre7, nombre8, nombre9){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}}× ${nombre5}}× ${nombre6}}× ${nombre7}}× ${nombre8}}× ${nombre9}** est égale à **${nombre1*nombre2, nombre3*nombre4*nombre5*nombre6*nombre7*nombre8*nombre9}**` })
}
else if(nombre1, nombre2, nombre3, nombre4, nombre5, nombre6, nombre7, nombre8){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}× ${nombre5}× ${nombre6}× ${nombre7}× ${nombre8}** est égale à **${nombre1*nombre2*nombre3*nombre4*nombre5*nombre6*nombre7*nombre8}**` })
}
else if(nombre1, nombre2, nombre3, nombre4, nombre5, nombre6, nombre7){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}× ${nombre5}× ${nombre6}× ${nombre7}** est égale à **${nombre1*nombre2*nombre3*nombre4*nombre5*nombre6*nombre7}**` })
}
else if(nombre1, nombre2, nombre3, nombre4, nombre5, nombre6){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}× ${nombre5}× ${nombre6}** est égale à **${nombre1*nombre2*nombre3*nombre4*nombre5*nombre6}**` })
}
else if(nombre1, nombre2, nombre3, nombre4, nombre5){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}× ${nombre5}** est égale à **${nombre1*nombre2*nombre3*nombre4*nombre5}**` })
}
else if(nombre1, nombre2, nombre3, nombre4){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}× ${nombre4}** est égale à **${nombre1*nombre2*nombre3*nombre4}**` })
}
else if(nombre1, nombre2, nombre3){
    interaction.reply({
            content: `**${nombre1} × ${nombre2}× ${nombre3}** est égale à **${nombre1*nombre2*nombre3}**` })
}
else {
    interaction.reply({
            content: `**${nombre1} × ${nombre2}** est égale à **${nombre1*nombre2}**` })
}


}
};
