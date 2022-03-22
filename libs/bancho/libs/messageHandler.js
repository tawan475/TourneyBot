module.exports = (bancho) => {
    bancho.on('channelJoin', (message) => {
        console.log(`Joined lobby ${message.channel.name}`);
    });
    
    bancho.on('channelLeave', (channel, err) => {
        if (err) {
            // This is considered soft error and
            // will not cause error event that make the bot to disconnect
            if (err.message === 'No such channel.') return console.log(`No such channel: ${channel}`);
        }
        console.log(`Left lobby ${channel}`);
    });
    
    bancho.on('message', (message) => {
        console.log("message " + message.raw);
    });
    
    bancho.on('pm', (message) => {
        console.log("pm " + message.raw);
    });
    
    bancho.on('sendMessage', (message) => {
        message = message.replace(/\r?\n$/, '');
        if (message.startsWith('PONG ')) return;
        console.log("> " + message);
    });

    bancho.on('multiplayer', (message) => {
        console.log("multiplayer " + message.raw);
    });
}