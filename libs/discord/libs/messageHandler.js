module.exports = (discord) => {
    this.log = discord.log.dir("messageHandler.js")
    discord.on('messageCreate', (message) => {
        if (message.content) this.log(`${message.author.username}: ${message.content}`);
    });
    
    return module.exports;
}