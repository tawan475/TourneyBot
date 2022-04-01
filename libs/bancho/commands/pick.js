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
        let mapMod = args[0].toUpperCase();
        let mapId = bancho.app.mappool[mapMod];
        if (!mapId) return message.channel.send(`${message.author} Invalid map!`);

        let mods = 'NF ';
        if (mapMod.startsWith("NM")) mods += "";
        if (mapMod.startsWith("HD")) mods += "HD ";
        if (mapMod.startsWith("HR")) mods += "HR ";
        if (mapMod.startsWith("DT")) mods += "DT ";

        if (mapMod.startsWith("FM")) mods += "FreeMod ";
        if (mapMod.startsWith("TB")) mods += "FreeMod ";

        message.channel.send(`!mp map ${mapId} 0`);
        message.channel.send(`!mp mods ${mods}`);
    };

    return module;
};
