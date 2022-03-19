const banchoClient = require('./banchoClient.js');
const bancho = new banchoClient({ 
    host: process.env.BANCHO_HOST,
    port: process.env.BANCHO_PORT,
    username: process.env.BANCHO_USERNAME,
    password: process.env.BANCHO_PASSWORD
});

bancho.on('connect', () => {
    console.log('Connected to bancho.');
});

bancho.on('disconnect', () => {
    console.log('Disconnected from bancho.');
});

bancho.on('data', (data) => {
    console.log(data);
});

bancho.connect();