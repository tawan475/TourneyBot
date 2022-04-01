module.exports = class tourneyLobby {
    constructor(bancho, channel, acronym) {
        this.bancho = bancho;
        this.channel = channel;
        this.acronym = acronym.toUpperCase();
    }
    async init(){
        let playerlist = await this.channel.getPlayers()
        this.playerOneUsername = playerlist.filter(p => p.slot === 0)[0]?.username;
        this.playerTwoUsername = playerlist.filter(p => p.slot === 1)[0]?.username;

        // lock the mp so players cant move to change team
        // first slot will always be blue
        // second slot will always be red
        this.channel.send(`!mp lock`);
        // set mp to TeamVS ScoreV2 with 2 slots
        this.channel.send(`!mp set 2 3 2`);

        this.channel.send("Tourney match created!");

        if (this.playerOneUsername && this.playerTwoUsername) {
            this.channel.send(`!mp name ${this.acronym}: (${this.playerOneUsername}) vs (${this.playerTwoUsername})`);
        }

        this.listener = (type, player) => {
            if (type === "leave") {
                if (player === this.playerOneUsername) this.playerOneUsername = null;
                if (player === this.playerTwoUsername) this.playerTwoUsername = null;
                return;
            }
            if (player.slot === 0) this.playerOneUsername = player.username;
            if (player.slot === 1) this.playerTwoUsername = player.username;
            if (this.playerOneUsername && this.playerTwoUsername) {
                this.channel.send(`!mp name ${this.acronym}: (${this.playerOneUsername}) vs (${this.playerTwoUsername})`);
            }
        }
        this.channel.on("playerLeft", player => this.listener("leave", player));
        this.channel.on("playerJoined", player => this.listener("join", player));
        this.channel.on("playerMoved", player => this.listener("move", player));
        this.channelLeaveListener = (destination) => {
            if (destination === this.channel.name) {
                this.channel.removeListener("playerLeft", this.listener);
                this.channel.removeListener("playerJoin", this.listener);
                this.channel.removeListener("playerMoved", this.listener);
                this.bancho.removeListener("channelLeave", this.channelLeaveListener);
                this.channel.removeListener("close", this.channelLeaveListener);
            }
        }
        this.bancho.on("channelLeave", this.channelLeaveListener);
        this.channel.on("close", this.channelLeaveListener(this.channel.name));
    }
}