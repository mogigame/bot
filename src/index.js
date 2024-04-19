const { MembershipScreeningFieldType } = require("discord-api-types/v9");
const { ShewenyClient } = require("sheweny");
const config = require("../config.json");
const { Client, Events, GatewayIntentBits } = require('discord.js');




const client = new ShewenyClient({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
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
  mode: "development", // Change to production for production bot0
});



client.login(config.DISCORD_TOKEN);