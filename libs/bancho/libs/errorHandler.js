module.exports = (bancho) => {
    bancho.on('error', (err) => {
        // Don't forget to handle error correctly!
        console.error(err);
    });
}