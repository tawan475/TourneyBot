module.exports = function (bancho) {
    this.log = bancho.log.dir("gacha.js");
    module.log = this.log
    module.aliases = ['startroll'];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;

        message.channel.send("Please say !roll to start the gacha! Whoever get the highest get to choose between picking and baning first! learn more: !pick !ban !tiebreaker");
    };

    return module;
};
