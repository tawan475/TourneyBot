const EventEmitter = require('eventemitter3');
const { Socket } = require('net');

module.exports = class banchoClient extends EventEmitter {
    // Constructor
    constructor(host, port, username, password) {
        super();

        this._server = { host, port };
        this._username = username;
        this._password = password;

        this.messageQueue = [];

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

        // Socket is disconnected
        this._socket.on('end', () => {
            this.emit('end');
        });

        this._socket.on('close', () => {
            while (this.messageQueue.length > 0) {
                const obj = this._outgoing_messages.shift();
                obj.callback();
            }

            this._buffer = '';
            clearInterval(this._writer);
            this._writer = null;
            this.emit('disconnect');
        });

        this._socket.connect(this._server, () => {

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