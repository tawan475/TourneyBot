const path = require('path');
module.exports = (app) => {
    const { banchoClient } = require('@tawan475/bancho.js');
    const bancho = new banchoClient();

    // attach main app to bancho
    bancho.app = app
    // Attach bancho to main application
    app.bancho = bancho;
    // setup dirname for bancho
    bancho.dirname = path.join(app.dirname, './libs/bancho');
    // branch log directory from main application
    bancho.log = app.log.dir("bancho/");

    this.log = bancho.log.dir("index.js");
    
    bancho.once('ready', () => {
        this.log('Connected and logged in to bancho.');
    });

    bancho.on('disconnect', () => {
        // Disconnected from bancho succesfully, you should kill the process or re-login 
        this.log('Disconnected from bancho.');
    });

    require("./loader.js")(bancho, [
        path.join(bancho.dirname, './libs'),
    ]);

    bancho.login({
        username: process.env.BANCHO_USERNAME,
        password: process.env.BANCHO_PASSWORD,
    });
}