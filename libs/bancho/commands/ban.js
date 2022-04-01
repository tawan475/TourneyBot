module.exports = function (bancho) {
    this.log = bancho.log.dir("ban.js");
    module.log = this.log
    module.aliases = [];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;
        
        return message.channel.send(`If you choose to ban first, you proceed with banning a map from the pool, after that your opponent also bans one map and then proceeds to pick the first map.`);
    };

    return module;
};
