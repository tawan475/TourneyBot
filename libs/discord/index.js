module.export = (app) => {
    const { Client, Intents } = require('discord.js');
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    // Add logger for discord
    client.log = (...args) => app.log("Discord: ",...args);

    client.once('ready', () => {
        
    });

    // Login to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN);
}