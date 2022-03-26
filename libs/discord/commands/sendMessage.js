module.exports = function (discord) {
    this.log = discord.log.dir("sendToBancho.js");
    module.log = this.log;
    module.aliases = ['send'];
    module.cooldown = 2000;
    module.execute = function execute(discord, message, args) {
        if (!discord.app.discordModeratorId.includes(message.author.id)) {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        let destination = args.shift();
        if (!args.length || !args.join("")) return message.reply("Please provide a message to send!");
        return message.reply("Sending the message! waiting for confirmation...").then(msg => {
            discord.app.bancho.pm(destination, args.join(" "));
            let listener = (message, err) => {
                if (!err) return;
                if (message !== destination) return;
                if (err.message === 'No such channel.') {
                    msg.edit(`No such channel: ${destination}`);
                }
                if (err.message === 'No such nick.') {
                    msg.edit(`No such nick: ${destination}`);
                }
                discord.app.bancho.removeListener("pm", listener);
                discord.app.bancho.removeListener("channelLeave", listener);
            };
            discord.app.bancho.on("pm", listener)
            discord.app.bancho.on("channelLeave", listener)
        })
    };

    return module;
};
