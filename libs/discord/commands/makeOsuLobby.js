module.exports = function (discord) {
    this.log = discord.log.dir("makeOsuLobby.js");
    module.aliases = ['makelobby']
    module.cooldown = 2000
    module.execute = function execute(discord, message, args) {
        if (message.author.id !== "728267443394576434") {
            return message.reply("Sorry! you do not have permissions to do that.");
        }
        if (!args.length || !args.join("")) return message.reply("Please provide a lobby name!");
        let lobbyName = args.join(" ");
        return message.reply("Creating a lobby, please wait...").then(async msg => {
            let lobby = await discord.app.bancho.createMultiplayer(lobbyName);
            console.log(lobby, lobby.matchId);
            return msg.edit(`Lobby created! \`#mp_${lobby.matchId}\`\r\n` +
            `\`!mp join #mp_${lobby.matchId}\`\r\n` +
            `https://osu.ppy.sh/mp/${lobby.matchId}`);
        })
    }

    return module;
};
