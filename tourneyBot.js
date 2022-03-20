require('dotenv').config();
const banchoClient = require('./banchoClient.js');
const bancho = new banchoClient();

bancho.once('ready', () => {
    console.log('Connected and logged in to bancho.');
});

bancho.on('disconnect', () => {
    console.log('Disconnected from bancho.');
});

bancho.on('message', (message) => {
    console.log(message.raw);
});

bancho.on('pm', (pm) => {
    console.log(pm);
});

bancho.login({
    username: process.env.BANCHO_USERNAME,
    password: process.env.BANCHO_PASSWORD,
});