const { Command } = require("sheweny");
const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "Avertir un membre. Après plusieurs avertissements, il sera kické puis banni.",
            type: 'SLASH_COMMAND',
            category: "Misc",
            cooldown: 3,
            userPermissions: [PermissionsBitField.Flags.ModerateMembers],
            options: [
                {
                    name: "name",
                    description: "Utilisateur à avertir",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Raison de l'avertissement",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }

    async execute(interaction) {
        const user = interaction.options.getMember("name");
        const reason = interaction.options.getString("reason");
        const configPath = path.resolve(__dirname, "../../../warnings.json");

        if (!user) {
            return interaction.reply({
                content: "Vous devez mentionner un utilisateur à avertir.",
                ephemeral: true,
            });
        }

        let warnings = {};
        if (fs.existsSync(configPath)) {
            warnings = JSON.parse(fs.readFileSync(configPath, "utf8"));
        }

        if (!warnings[user.id]) {
            warnings[user.id] = { count: 0 };
        }
        warnings[user.id].count += 1;

        try {
            await user.send(`Vous avez été averti dans le serveur **${interaction.guild.name}**. Raison : **${reason}**`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi du message d'avertissement à ${user.tag}: ${error}`);
        }

        if (warnings[user.id].count >= 3) {
            try {
                await user.kick(`Nombre d'avertissements atteint : ${reason}`);
                await user.ban({ reason: `Nombre d'avertissements atteint : ${reason}` });
                interaction.reply({
                    content: `${user} a été kické puis banni pour avoir atteint 3 avertissements. Raison : **${reason}**`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(`Erreur lors du kick ou du ban de ${user.tag}: ${error}`);
                interaction.reply({
                    content: `Erreur lors de l'exécution de la commande sur ${user}.`,
                    ephemeral: true,
                });
            }
        } else {
            interaction.reply({
                content: `L'utilisateur ${user} a été averti avec succès. Raison : **${reason}**. Nombre d'avertissements: ${warnings[user.id].count}`,
                ephemeral: true,
            });
        }

        fs.writeFileSync(configPath, JSON.stringify(warnings, null, 2), "utf8");
    }
};
