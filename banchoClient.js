const EventEmitter = require('eventemitter3');
const { Socket } = require('net');

module.exports = class banchoClient extends EventEmitter {
    // Constructor
    constructor({ host, port, username, password }, config) {
        super();

        this._config = config;

        this._server = { host, port };
        this._username = username;
        this._password = password;

        this._messageQueue = [];
        this._messageProcessor = null;

        // Create socket
        this._socket = new Socket();
    }

    // Connect to the server
    connect() {
        // Configure socket
        this._socket.setEncoding('utf8');
        this._socket.setKeepAlive(true);
        this._socket.setNoDelay(true);
        this._socket.setTimeout(10000, () => {
            this._socket.emit('error', new Error('Timed out.'));
        });

        // Configure events
        // Handle error
        this._socket.on('error', (err) => {
            this.emit('error', err);
        });

        // Socket is connected
        this._socket.on('connect', () => {
            this.emit('connect');
        });

        // Recieve incoming data
        this._socket.on('data', (data) => {
            this.emit('data', data);
        });

        // Socket is half close
        this._socket.on('end', () => {
            this.emit('end');
        });

        // Socket is closed
        this._socket.on('close', (hadError) => {
            this.emit('close', hadError);
        });

        this._socket.connect(this._server, () => {
            this._messageProcessor = setInterval(() => {

            }, this.config.messageDelay);

            // Ready to send messages
            this._socket.on('ready', () => {
                this.emit('ready');
            });
        });
    }

    // Terminate the connection
    close() {
        this._socket.destroy();
        this._socket.emit('close', "Terminate by user");
    }

}