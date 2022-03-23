const fs = require('fs');
const { Collection } = require('discord.js');

module.exports = (discord) => {
    this.log = discord.log.dir("messageHandler.js");
    discord.cooldowns = new Collection();

    discord.on('messageCreate', (message) => {
        if (message.author.bot || !message.guild) return;
        this.log(`<${message.author.username}>: ${message.content}`);

        var prefixes = discord.prefixes;
        const prefixRegex = new RegExp(`^${prefixes.join('|^')}`);
        if (!prefixRegex.test(message)) return;
        const [prefix, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (message.author.id == '728267443394576434') {
            if (command === 'eval') try {
                message.channel.say("Successful Evaluation: " +
                    eval(message.content.slice(prefix.length + command.length))
                )
            } catch (error) {
                this.log(error.toString(), "error");
                message.channel.send(error.toString())
            };
            // if (command === 'reload' || command === 'restart') discord.say(channel, "Restarting...").then(() => process.exit(0));
        }

        var rCommand = discord.commands[command] ||
            discord.commands[Object.keys(discord.commands)
                .filter(cmd => discord.commands[cmd].aliases &&
                    discord.commands[cmd].aliases.includes(command))];

        if (!rCommand || rCommand.length) return;
        let fileHASH = discord.app.HASH(fs.readFileSync(rCommand.filePath));
        if (rCommand.HASH !== fileHASH)
            discord[rCommand.folder][rCommand.filename] = require(rCommand.filePath)

        if (!discord.cooldowns.has(rCommand.name)) discord.cooldowns.set(rCommand.name, new Collection());
        let commandCooldown = discord.cooldowns.get(rCommand.name);
        if (commandCooldown.has(message.author.id)) {
            var cooldown = commandCooldown.get(message.author.id);
            if (cooldown.ban) return;
            var mustWait = rCommand.cooldown;
            var timeSince = Date.now() - cooldown.since;
            if (timeSince < mustWait) {
                commandCooldown.set(message.author.id, { since: cooldown.since, ban: true });
                setTimeout(() => {
                    commandCooldown.set(message.author.id, { since: cooldown.since, ban: false })
                }, 3750);
                return message.channel.send(`${message.author} Woah! Woah! too fast buddy, try again in ${Math.floor((mustWait - timeSince) / 1000)} second.`);
            }
        }
        commandCooldown.set(message.author.id, { since: Date.now(), ban: false });
        // We don't have to delete individual cooldown from command's cooldown list
        // since the user will pass (timeSince < mustWait) check next time the user uses the command,
        // They will pass the check and reassign cooldown since value to the moment they used the command.

        rCommand.execute(discord, message, args);

    });

    return module;
}