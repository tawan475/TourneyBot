require('dotenv').config();
const { banchoClient } = require('@tawan475/bancho.js');
const bancho = new banchoClient();

bancho.on('error', (err) => {
    console.error(err);
});

bancho.once('ready', () => {
    console.log('Connected and logged in to bancho.');
});

bancho.on('disconnect', () => {
    console.log('Disconnected from bancho.');
});

bancho.on('lobbyJoin', (lobby) => {
    console.log(`Joined lobby ${lobby.channel.name}`);
});

bancho.on('lobbyLeave', (lobby) => {
    console.log(`Left lobby ${lobby.channel.name}`);
});

bancho.on('message', (message) => {
    console.log(message.raw);
});

bancho.on('pm', (pm) => {
    console.log(pm);
});

bancho.on('multiplayer', (message) => {
    console.log(message);
});


bancho.login({
    username: process.env.BANCHO_USERNAME,
    password: process.env.BANCHO_PASSWORD,
});