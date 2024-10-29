const { ShewenyClient } = require("sheweny");
const { Intents } = require('discord.js');
const fs = require('fs');

let config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
  console.error('Erreur lors de la lecture du fichier de configuration:', error);
}


const client = new ShewenyClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
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
  mode: "production",
});



client.suggestionChannelId = config.suggestionChannelId;

client.login(config.DISCORD_TOKEN);
