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

    const messageListener = (type, message) => {
        if (type === 'sendMessage') {
            message = message.replace(/\r?\n$/, '');
            if (message.startsWith('PONG ')) return;
            this.log("> " + message);
            const sendToMultiplayerRegex = /^PRIVMSG (#mp_[0-9]+) :(.+)$/;
            let [found, destination, content] = message.match(sendToMultiplayerRegex);
            if (!found) return;
            message = {
                type: 'pm',
                author: bancho.username,
                channel: bancho.getChannel(destination),
                content: content
            }
        }
        if (!["multiplayer", 'pm'].includes(type)) return; // filter out non-mp/pm messages

    };
    bancho.on('sendMessage', message => messageListener("sendMessage", message));
    bancho.on('multiplayer', message => messageListener("multiplayer", message));
    bancho.on('pm', message => messageListener("pm", message));

    return module;
}