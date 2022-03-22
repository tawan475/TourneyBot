module.exports = (app) => {
    const { banchoClient } = require('@tawan475/bancho.js');
    const bancho = new banchoClient();

    // Attach bancho to main application
    app.bancho = bancho;
    
    bancho.once('ready', () => {
        console.log('Connected and logged in to bancho.');
    });

    bancho.on('disconnect', () => {
        // Disconnected from bancho succesfully, you should kill the process or re-login 
        console.log('Disconnected from bancho.');
    });

    require("./libs/errorHandler.js")(bancho);
    require("./libs/messageHandler.js")(bancho);

    bancho.login({
        username: process.env.BANCHO_USERNAME,
        password: process.env.BANCHO_PASSWORD,
    });
}