module.exports = function (bancho) {
    this.log = bancho.log.dir("tiebreaker.js");
    module.log = this.log
    module.aliases = ['tb'];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;
        
        return message.channel.send(`A tiebreaker is played when both players are one point away from winning the match. The specific map is gonna be picked by the referee using !roll, Mods are Freemod.`);
    };

    return module;
};
