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
            // Activate message processor
            this._messageProcessor = setInterval(() => {
                let messageObj = this._messageQueue.shift();
                this._socket.write(messageObj.message + '\r\n');
                // acknowledge the message
                messageObj.resolve();
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

    // Send a message
    send(message) {
        return new Promise((resolve, reject) => {
            if (!this._socket || this._socket.readyState !== 'open') {
                reject(new Error('Socket is not connected.'));
            }

            if (message.length > this.config.messageSize) {
                reject(new Error('Message is too big.'));
            }

            this._messageQueue.push({ message, resolve, reject });
        });
    }
}