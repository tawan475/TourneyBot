module.exports = (app) => {
    const { Client, Intents } = require('discord.js');
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    // Attach discord to main application
    app.discord = client;
    // branch log directory from main application
    client.log = app.log.dir("discord/");

    client.once('ready', () => {
        client.log("Connected to discord.");
    });

    // Login to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN);
}