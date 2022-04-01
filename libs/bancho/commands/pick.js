module.exports = function (bancho) {
    this.log = bancho.log.dir("pick.js");
    module.log = this.log
    module.aliases = [];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;
        if (!message.channel.referees.include(message.author)) 
            return message.channel.send(`If you choose to pick first, the other player will choose a map to ban and then you choose a map to ban and then you can pick a map`);

        if (!args[0]) return message.channel.send(`${message.author} Please specify a map!`);
        
    };

    return module;
};
