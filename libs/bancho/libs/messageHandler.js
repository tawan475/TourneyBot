const fs = require('fs');
const { Collection } = require('discord.js');

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

    const messageListener = (type, message, err) => {
        if (err) return;
        if (type === 'sendMessage') {
            message = message.replace(/\r?\n$/, '');
            if (message.startsWith('PONG ')) return;
            this.log("> " + message);
            const sendToMultiplayerRegex = /^PRIVMSG (#mp_[0-9]+) :(.+)$/;
            if (!sendToMultiplayerRegex.test(message)) return;
            let [, destination, content] = message.match(sendToMultiplayerRegex);
            let channel = bancho.getChannel(destination);
            if (!channel) return;
            type = 'pm';
            message = {
                type: 'pm',
                author: bancho.username,
                channel: channel,
                content: content
            }
        }
        if (!["multiplayer", 'pm'].includes(type)) return; // filter out non-mp/pm messageSize
        this.log(`${type} <${message.author}>@${message.channel.name}: ${message.content}`);

        if (!message.content.startsWith(bancho.prefix)) return;
        const args = message.content.slice(bancho.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        var rCommand = bancho.commands[command] ||
            bancho.commands[Object.keys(bancho.commands)
                .filter(cmd => bancho.commands[cmd].aliases &&
                    bancho.commands[cmd].aliases.includes(command))];

        if (!rCommand || rCommand.length) return;
        let fileHASH = bancho.app.HASH(fs.readFileSync(rCommand.filePath));
        if (rCommand.HASH !== fileHASH)
            bancho[rCommand.folder][rCommand.filename] = require(rCommand.filePath)

        if (!bancho.cooldowns.has(rCommand.name)) bancho.cooldowns.set(rCommand.name, new Collection());
        let commandCooldown = bancho.cooldowns.get(rCommand.name);
        if (commandCooldown.has(message.author.id)) {
            var cooldown = commandCooldown.get(message.author.id);
            if (cooldown.ban) return;
            var mustWait = rCommand.cooldown;
            var timeSince = Date.now() - cooldown.since;
            if (timeSince < mustWait) {
                commandCooldown.set(message.author.id, { since: cooldown.since, ban: true });
                setTimeout(() => {
                    commandCooldown.set(message.author.id, { since: cooldown.since, ban: false })
                }, 3750);
                return message.channel.send(`${message.author} Woah! Woah! too fast buddy, try again in ${Math.floor((mustWait - timeSince) / 1000)} second.`);
            }
        }
        commandCooldown.set(message.author.id, { since: Date.now(), ban: false });
        // We don't have to delete individual cooldown from command's cooldown list
        // since the user will pass (timeSince < mustWait) check next time the user uses the command,
        // They will pass the check and reassign cooldown since value to the moment they used the command.

        rCommand.execute(bancho, message, args);
    };
    bancho.on('sendMessage', (message, err) => messageListener("sendMessage", message, err));
    bancho.on('multiplayer', (message, err) => messageListener("multiplayer", message, err));
    bancho.on('pm', (message, err) => messageListener("pm", message, err));

    return module;
}