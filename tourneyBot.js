require('dotenv').config();
const banchoClient = require('./banchoClient.js');
const bancho = new banchoClient({ 
    host: process.env.BANCHO_HOST,
    port: process.env.BANCHO_PORT,
    username: process.env.BANCHO_USERNAME,
    password: process.env.BANCHO_PASSWORD
});

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
    console.log(pm.author + ': ' + pm.content);
});

bancho.connect();