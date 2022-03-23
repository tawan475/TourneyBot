const fs = require('fs');
const path = require('path');

module.exports = (discord, paths = []) => {
    this.log = discord.log.dir("loader.js");
    paths.forEach(pathToFile => {
        let arr = pathToFile.split("\\");
        let folder = arr[arr.length - 1];
        discord[folder] = {};

        let commandFile = fs.readdirSync(pathToFile).filter(file => file.endsWith(".js"));
        for (const file of commandFile) {
            const filePath = path.join(pathToFile, "/" + file);
            const toLoad = require(filePath)(discord);
            let filename = file.replace(/\.js$/, "");

            let fileHASH = discord.app.HASH(fs.readFileSync(filePath));

            toLoad.filePath = filePath;
            toLoad.folder = folder;
            toLoad.filename = filename;
            toLoad.HASH = fileHASH;

            discord[folder][filename] = toLoad;
            this.log(`Loaded ./${path.relative(discord.dirname, filePath).replace(/\\/g, '/')}`);
        }
    });
}