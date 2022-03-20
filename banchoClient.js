const EventEmitter = require('eventemitter3');
const { Socket } = require('net');

module.exports = class banchoClient extends EventEmitter {
    // Constructor
    constructor({ host, port, username, password }, config = {
        messageDelay: 1000,
        messageSize: 449
    }) {
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
        let buffer = '';
        this._socket.on('data', (data) => {
            this.emit('data', data);
            buffer += data.toString().replace(/\r/g, "");
            let lines = buffer.split('\n');

            // if the last line is not complete, then we need carry over and wait for the next data event
            if (!lines[ lines.length - 1 ].endsWith('\n')) {
                buffer = lines.pop();
            }

            // emit each line separately
            for (line of lines){
                this.emit('messge', line)
            }
        });

        // Socket is half close
        this._socket.on('end', () => {
            this.emit('end');
            
            // Terminate the message processor
            clearInterval(this._messageProcessor);
        });

        // Socket is closed
        this._socket.on('close', (hadError, reason) => {
            this.emit('close', hadError, reason);

            // Terminate the message processor
            clearInterval(this._messageProcessor);
        });

        this._socket.connect(this._server, () => {
            this.send(`PASS ${this._password}`);
            this.send(`USER ${this._username} 0 * :${this._username}`);
            this.send(`NICK ${this._username}`);


            // Activate message processor
            this._messageProcessor = setInterval(() => {
                let messageObj = this._messageQueue.shift();
                if (!messageObj || !messageObj?.message) return;
                this._socket.write(messageObj.message + '\r\n');
                // acknowledge the message
                messageObj.resolve();
            }, this._config.messageDelay);

            // Ready to send messages
            this._socket.on('ready', () => {
                this.emit('ready');
            });
        });
    }

    // Terminate the connection
    close() {
        this._socket.destroy();
        this._socket.emit('close', false, "Terminate by user");
    }

    // Send a message
    send(message) {
        return new Promise((resolve, reject) => {
            // // not needed due to the message processor only send message when it is connected and ready
            // if (!this._socket || this._socket.readyState !== 'open') {
            //     reject(new Error('Socket is not connected.'));
            // }

            if (message.length > this._config.messageSize) {
                reject(new Error('Message is too big.'));
            }

            this._messageQueue.push({ message, resolve, reject });
        });
    }
}