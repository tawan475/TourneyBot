require('dotenv').config();
const { banchoClient, banchoLobby } = require('@tawan475/bancho.js');
const bancho = new banchoClient();

bancho.once('ready', () => {
    console.log('Connected and logged in to bancho.');

    // 332 multiplayer id
    // 333 unix server time
    // 353 prob userlist
    // 366 end of list
});

bancho.on('disconnect', () => {
    console.log('Disconnected from bancho.');
});

bancho.on('lobbyJoined', (lobby) => {
    console.log(`Joined lobby ${lobby.channel}`);
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