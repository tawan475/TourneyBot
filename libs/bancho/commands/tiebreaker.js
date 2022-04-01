module.exports = function (bancho) {
    this.log = bancho.log.dir("tiebreaker.js");
    module.log = this.log
    module.aliases = ['tb'];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;
        
        return message.channel.send(`A tiebeaker is FreeMod map, It will be decided with !roll by a referee.`);
    };

    return module;
};
