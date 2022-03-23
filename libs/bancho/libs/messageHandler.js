module.exports = (bancho) => {
    this.log = bancho.log.dir("messageHandler.js")
    bancho.on('channelJoin', (message) => {
        this.log(`Joined lobby ${message.channel.name}`);
    });
    
    bancho.on('channelLeave', (channel, err) => {
        if (err) {
            // This is considered soft error and
            // will not cause error event that make the bot to disconnect
            if (err.message === 'No such channel.') return this.log(`No such channel: ${channel}`);
        }
        this.log(`Left lobby ${channel}`);
    });
    
    bancho.on('message', (message) => {
        this.log("message " + message.raw);
    });
    
    bancho.on('pm', (message) => {
        this.log("pm " + message.raw);
    });
    
    bancho.on('sendMessage', (message) => {
        message = message.replace(/\r?\n$/, '');
        // if (message.startsWith('PONG ')) return;
        this.log("> " + message);
    });

    bancho.on('multiplayer', (message) => {
        this.log("multiplayer " + message.raw);
    });
    
    return module.exports;
}