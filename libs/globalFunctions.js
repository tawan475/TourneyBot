module.export = (app) => {
    app.log = (...args) => {
        app.log("Discord: ",...args);
    }
}