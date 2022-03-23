const path = require('path');
module.exports = (app) => {
    const { Client, Intents } = require('discord.js');
    const discord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    // Attach main app to discord
    discord.app = app;
    // Attach discord to main application
    app.discord = discord;
    // setup dirname for discord
    discord.dirname = path.join(app.dirname, './libs/discord');
    // branch log directory from main application
    discord.log = app.log.dir("discord/");

    this.log = discord.log.dir("index.js");

    discord.once('ready', () => {
        this.log("Connected to discord.");
    });

    // Use loader to attach stuff to discord
    require("./loader.js")(discord);

    // Login to Discord with your client's token
    discord.login(process.env.DISCORD_TOKEN);
}