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
                    if (err.message === 'No such channel.') return msg.edit(`No such channel: ${channel}`);
                    return msg.edit("Unexpected Error!")
                }
                if (message.channel.name !== destination) return;

                msg.edit(`${msg.channel.name}: ${message.content}`);
                discord.app.bancho.removeListener("pm", listener);
                discord.app.bancho.removeListener("channelLeave", listener);
            };
            discord.app.bancho.on("pm", listener)
            discord.app.bancho.on("channelLeave", listener)
        })
    }

    return module;
};
