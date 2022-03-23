const fs = require('fs');
const path = require('path');

module.exports = (bancho, paths = []) => {
    this.log = bancho.log.dir("loader.js");
    paths.forEach(pathToFile => {
        let arr = pathToFile.split("\\");
        let folder = arr[arr.length - 1];
        bancho[folder] = {};

        let commandFile = fs.readdirSync(pathToFile).filter(file => file.endsWith(".js"));
        for (const file of commandFile) {
            const filePath = path.join(pathToFile, "/" + file);
            const toLoad = require(filePath)(bancho);
            let filename = file.replace(/\.js$/, "");

            let fileHASH = bancho.app.HASH(fs.readFileSync(filePath));

            toLoad.filePath = filePath;
            toLoad.folder = folder;
            toLoad.filename = filename;
            toLoad.HASH = fileHASH;

            bancho[folder][filename] = toLoad;
            this.log(`Loaded ${path.relative(bancho.dirname, filePath).replace(/\\/g, '/')}`);
        }
    });
}