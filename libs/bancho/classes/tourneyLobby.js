module.exports = class tourneyLobby {
    constructor(bancho, channel, acronym, mappool){
        this.bancho = bancho;
        this.channel = channel;
        this.acronym = acronym.toUpperCase();
        this.mappool = mappool;

        let players = await this.channel.getPlayers();

        this.playerOneUsername = players.filter(p => p.slot === 0)[0].username;
        this.playerTwoUsername = players.filter(p => p.slot === 1)[0].username;

        // lock the mp so players cant move to change team
        // first slot will always be blue
        // second slot will always be red
        this.channel.send(`!mp lock`);
        // set mp to TeamVS ScoreV2 with 2 slots
        this.channel.send(`!mp set 2 3 2`);

        this.channel.send("Tourney match created!");

        if (this.playerOneUsername && this.playerOneUsername) {
            this.channel.send(`!mp name ${this.acronym}: (${playerOneUsername}) vs (${playerTwoUsername})`);
        }

        const listener = (type, player) => {
            if (type === "leave"){
                if (player === this.playerOneUsername) this.playerOneUsername = null;
                if (player === this.playerOneUsername) this.playerOneUsername = null;
                return;
            }
            if (player.slot === 0) this.playerOneUsername = player.username;
            if (player.slot === 1) this.playerOneUsername = player.username;
            if (this.playerOneUsername && this.playerOneUsername) {
                channel.send(`!mp name ${acronym}: (${this.playerOneUsername}) vs (${this.playerOneUsername})`);
            }
        }
        this.channel.on("playerLeft", player => listener("leave", player));
        this.channel.on("playerJoined", player => listener("join", player));
        this.channel.on("playerMoved", player => listener("move", player));
        const channelLeaveListener = (destination) => {
            if (destination === this.channel.name) {
                this.channel.removeListener("playerLeft", listener);
                this.channel.removeListener("playerJoin", listener);
                this.channel.removeListener("playerMoved", listener);
                this.bancho.removeListener("channelLeave", channelLeaveListener);
            }
        }
        this.bancho.on("channelLeave", channelLeaveListener);
    }
}