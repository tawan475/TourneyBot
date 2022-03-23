module.exports = function (discord) {
    this.log = discord.log.dir("sendToBancho.js");
    module.aliases = ['bancho']
    module.cooldown = 1000
    module.execute = function execute(discord, message, args) {
        if (message.author.id !== "728267443394576434") {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        return message.reply("Sending the message! waiting for reply...").then(msg => {
            discord.app.bancho.pm("BanchoBot", args.join(" "));
            let listener = (pm) => {
                if (pm.author !== "BanchoBot") return;
                msg.edit("BanchoBot: " + pm.content);
                discord.app.bancho.removeListener("pm", listener);
            };
            discord.app.bancho.on("pm", listener)
        })
    }

    return module;
};
