require('dotenv').config();
const { banchoClient, banchoLobby } = require('@tawan475/bancho.js');
const bancho = new banchoClient();

bancho.once('error', (err) => {
    console.error(err);
});

bancho.once('ready', () => {
    console.log('Connected and logged in to bancho.');
    bancho.join("#mp_98947336"); // test lobby
    setTimeout(() => {
        bancho.send("PART #mp_98947336"); // leave lobby
    }, 6000)
});

bancho.on('disconnect', () => {
    console.log('Disconnected from bancho.');
});

bancho.on('lobbyJoined', (lobby, err) => {
    if (err){
        console.log(err);
        return;
    }
    console.log(`Joined lobby ${lobby.channel}`);
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