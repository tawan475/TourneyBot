require('dotenv').config();
const app = this;
app.dirname = __dirname;

// IMPORTENT VALUES
app.acronym = "PMT"; // tourney's acronym
app.discordModeratorId = ["728267443394576434"];
app.mappool = require('./mappools/PMT1-2.json');

// Add global functions ie. logging functions, etc.
require('./libs/globalFunctions.js')(app);

// Require the bancho
require('./libs/bancho/index.js')(app);

// Require the discord
require('./libs/discord/index.js')(app);
