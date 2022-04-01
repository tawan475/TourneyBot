const tourneyLobby = require('../casses/tourneyLobby.js');

module.exports = function (bancho) {
    this.log = bancho.log.dir("makeTourney.js");
    module.log = this.log
    module.aliases = ['tourney', 'maketourney'];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        // make 1v1 tourney

        if (!message.channel.name.startsWith("#mp_")) return;
        if (!message.channel.isRef) return channel.send(`I am not a referee! try !mp addref ${bancho.username}`);
        if (bancho.tourneyLobby.has(message.channel.name)) return channel.send(`This match is already been marked as a tournament lobby!`);
        module.log(`Making tourney for ${message.channel.name}`);

        let lobby = new tourneyLobby(bancho, message.channel, bancho.app.acronym, bancho.app.mappool);

        // add this channel to tourney lobbies
        bancho.tourneyLobby.set(message.channel.name, lobby);
    };

    return module;
};
