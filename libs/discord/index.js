module.exports = (app) => {
    const { Client, Intents } = require('discord.js');
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    // Attach discord to main application
    app.discord = client;
    // branch log directory from main application
    client.log = app.log.dir("discord/");
    this.log = client.log.dir("index.js");

    client.once('ready', () => {
        this.log("Connected to discord.");
    });

    require("./libs/messageHandler.js")(client);

    // Login to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN);
}