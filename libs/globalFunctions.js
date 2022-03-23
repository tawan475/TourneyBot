module.exports = (app) => {
    const Logger = require('@tawan475/log.js');
    let logger = new Logger({
        consoleLog: true,
        logToFile: true,
        LogFile: "./log.log"
    })
    app.log = logger.dir("/");
}