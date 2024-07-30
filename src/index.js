const { ShewenyClient } = require("sheweny");
const { Intents } = require('discord.js');
const fs = require('fs');

// Charge la configuration depuis config.json
let config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
  console.error('Erreur lors de la lecture du fichier de configuration:', error);
}

// Crée une instance de ShewenyClient
const client = new ShewenyClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    // Ajoute d'autres intents si nécessaire
  ],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      prefix: "m!",
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
  },
  mode: "production", // Change to production for production bot
});

// Assigne l'ID du salon de suggestion à la propriété client
client.suggestionChannelId = config.suggestionChannelId;

// Connecte le bot avec le token
client.login(config.DISCORD_TOKEN);
