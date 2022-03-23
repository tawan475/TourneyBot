module.exports = (client) => {
    this.log = client.log.dir("messageHandler.js")
    client.on('messageCreate', (message) => {
        if (message.content) this.log(`${message.author.username}: ${message.content}`);
    });
}