module.exports = function (discord) {
    this.log = discord.log.dir("sendToBancho.js");
    module.aliases = ['send']
    module.cooldown = 2000
    module.execute = function execute(discord, message, args) {
        if (message.author.id !== "728267443394576434") {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        let destination = args.shift();
        return message.reply("Sending the message! waiting for confirmation...").then(msg => {
            discord.app.bancho.pm(destination, args.join(" "));
            let listener = (message, err) => {
                if (err) {
                    if (err.message === 'No such channel.') return msg.edit(`No such channel: ${destination}`);
                    if (err.message === 'No such nick.') return msg.edit(`No such nick: ${destination}`);
                    return msg.edit("Unexpected Error!")
                }
                let channel = message.type === 'PRIVMSG' ? message.author : message.channel.name;
                if (channel !== destination) return;
                
                msg.edit(`${channel}: ${message.content}`);
                discord.app.bancho.removeListener("pm", listener);
                discord.app.bancho.removeListener("channelLeave", listener);
            };
            discord.app.bancho.on("pm", listener)
            discord.app.bancho.on("channelLeave", listener)
        })
    }

    return module;
};
