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

        // add this channel to tourney lobbies
        bancho.tourneyLobby.set(message.channel.name, message.channel)

        // remove everyone from the multiplayer
        let players = await message.channel.getPlayers();
        let channel = message.channel;
        // channel.send(`!mp size 1`)
        // let firstPlayer = players.filter(p => p.slot === 1)[0];
        // if (firstPlayer && firstPlayer.username) channel.send(`!mp kick ${firstPlayer.username}`);

        let playerOneUsername = players.filter(p => p.slot === 0)[0].username;
        let playerTwoUsername = players.filter(p => p.slot === 1)[0].username;

        // lock the mp so players cant move to change team
        // first slot will always be blue
        // second slot will always be red
        channel.send(`!mp lock`);
        // set mp to TeamVS ScoreV2 with 2 slots
        channel.send(`!mp set 2 3 2`);
        let acronym = bancho.app.acronym.toUpperCase();

        channel.send("Tourney match created!");

        if (playerOneUsername && playerTwoUsername) {
            channel.send(`!mp name ${acronym}: (${playerOneUsername}) vs (${playerTwoUsername})`);
        }

        const listener = (type, player) => {
            if (type === "leave"){
                if (player === playerOneUsername) playerOneUsername = null;
                if (player === playerTwoUsername) playerTwoUsername = null;
                return;
            }
            if (player.slot === 0) playerOneUsername = player.username;
            if (player.slot === 1) playerTwoUsername = player.username;
            if (playerOneUsername && playerTwoUsername) {
                channel.send(`!mp name ${acronym}: (${playerOneUsername}) vs (${playerTwoUsername})`);
            }
        }
        channel.on("playerLeft", player => listener("leave", player));
        channel.on("playerJoined", player => listener("join", player));
        channel.on("playerMoved", player => listener("move", player));
        const channelLeaveListener = (destination) => {
            if (destination === channel.name) {
                channel.removeListener("playerLeft", listener);
                channel.removeListener("playerJoin", listener);
                channel.removeListener("playerMoved", listener);
                bancho.removeListener("channelLeave", channelLeaveListener);
            }
        }
        bancho.on("channelLeave", channelLeaveListener);
    };

    return module;
};
