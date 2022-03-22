require('dotenv').config();
const app = this;

// Add global functions ie. logging functions, etc.
require('./libs/globalFunctions.js')(app);

// Require the bancho
require('./libs/bancho/index.js')(app);

// Require the discord
require('./libs/discord/index.js')(app);
