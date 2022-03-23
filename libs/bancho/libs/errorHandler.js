module.exports = (bancho) => {
    this.log = bancho.log.dir("errorHandler.js")
    bancho.on('error', (err) => {
        // Don't forget to handle error correctly!
        this.log("ERROR: ", err);
    });
    
    return module.exports;
}