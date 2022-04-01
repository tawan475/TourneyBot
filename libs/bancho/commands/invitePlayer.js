module.exports = function (bancho) {
    this.log = bancho.log.dir("invitePlayer.js");
    module.log = this.log
    module.aliases = ['invite'];
    module.cooldown = 2000;
    module.execute = async function execute(bancho, message, args) {
        if (!message.channel.name.startsWith("#mp_")) return;
        if (!message.channel.isRef) return message.channel.send(`I am not a referee! try !mp addref ${bancho.username}`);
        // if (!bancho.tourneyLobby.has(message.channel.name)) return message.channel.send(`This match is not a tournament lobby!`);
        if (!args.length) return;
        let inviting = args;

        let players = await message.channel.getPlayers();
        for (let player of inviting){
            if (players.filter(p => p.username === player)[0]) continue;
            module.log(`Inviting ${player} to ${message.channel.name}`);
            message.channel.send(`!mp invite ${player}`);
        }
    };

    return module;
};
