module.exports = function (discord) {
    this.log = discord.log.dir("sendToBancho.js");
    module.log = this.log;
    module.aliases = ['bancho'];
    module.cooldown = 2000;
    module.execute = function execute(discord, message, args) {
        if (!discord.app.discordModeratorId.includes(message.author.id)) {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        if (!args.length || !args.join("")) return message.reply("Please provide a message to send!");
        return message.reply("Sending the message! waiting for reply...").then(msg => {
            discord.app.bancho.pm("BanchoBot", args.join(" "));
            let timeout = setTimeout(() => {
                discord.app.bancho.removeListener("pm", listener);
                return msg.edit("Timed out!");
            }, 10000);
            let listener = (pm) => {
                if (pm.author !== "BanchoBot") return;
                msg.edit("BanchoBot: " + pm.content);
                discord.app.bancho.removeListener("pm", listener);
                return clearTimeout(timeout);
            };
            discord.app.bancho.on("pm", listener);
        })
    };

    return module;
};
