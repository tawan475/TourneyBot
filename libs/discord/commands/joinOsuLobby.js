module.exports = function (client) {
    module.name = "joinlobby"
    module.aliases = []
    module.cooldown = 1000
    module.execute = function execute(discord, message, args) {
        if (message.author.id !== "728267443394576434") {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        if (args[0] && !args[0].startsWith("#mp_")) return message.reply("Please use a valid lobby name! ie. #mp_98954523");
        let MP_channel = args[0];
        discord.app.bancho.join(MP_channel);
        return message.reply("Lobby joined!")
    }

    return module;
};
