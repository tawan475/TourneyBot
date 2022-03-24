module.exports = function (bancho) {
    this.log = bancho.log.dir("makeTourney.js");
    module.aliases = ['tourney', 'maketourney'] 
    module.cooldown = 2000
    module.execute = function execute(bancho, message, args) {
        // make 1v1 tourney
        if (!args.length || !args.join("")) return;
        if (!args[0] || args[0].length !== 3) return;

        // remove everyone from the multiplayer
        let players = await message.channel.getPlayers();
        channel.send(`!mp size 1`)
        let firstPlayer = players.filter(p => p.slot === 1)[0];
        if (firstPlayer && firstPlayer.username) channel.send(`!mp kick ${firstPlayer.username}`);

        // lock the mp so players cant move to change team
        // first slot will always be blue
        // second slot will always be red
        channel.send(`!mp lock`);
        // set mp to TeamVS ScoreV2 with 2 slots
        channel.send(`!mp set 2 3 2`);
        let acronym = bancho.app.acronym.toUpperCase();

        let playerOneUsername, playerTwoUsername;

        const listener = (type, player) => {
            if (type === "leave"){
                if (player.username === playerOneUsername) playerOneUsername = null;
                if (player.username === playerTwoUsername) playerTwoUsername = null;
                return;
            }
            if (player.slot === 1) playerOneUsername = player.username;
            if (player.slot === 2) playerTwoUsername = player.username;
            if (playerOneUsername && playerTwoUsername) {
                channel.send(`!mp name ${acronym}: (${playerOneUsername}) vs (${playerTwoUsername})`);
            }
        }
        channel.on("playerLeft", player => listener("leave", player));
        channel.on("playerJoin", player => listener("join", player));
        channel.on("playerMoved", player => listener("move", player))
    }

    return module;
};
