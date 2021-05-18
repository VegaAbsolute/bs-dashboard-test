const net = require('net');

class LoraLogger {
    constructor({ logger, Session, maxLength=10 }) {
        this.loraLogArray = []; //[{rowId: NUMBER, row: STRING},...]
        this.maxLength = maxLength;
        this.lastRowIdForToken = {}; //{token: rowId}

        this.logger = logger;
        this.rowId = 0;

        this.Session = Session;
    };


    removeOldTokens () {
        let newList = {}
        for(let token in this.lastRowIdForToken) {
            if (this.Session.isTokenExists(token)) {
                newList[token] = this.lastRowIdForToken[token];
            }
        }
        this.lastRowIdForToken = newList;
    };


    listen ({host, port}) {
        this.logger.debug('Lora logger listen port.');
        const tcpServer = net.createServer();

        tcpServer.on('connection', (sock) => {
            this.logger.debug('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            sock.on('data', (data) => {
                if (sock.remoteAddress === '127.0.0.1') {

                    this.loraLogArray.push({rowId: this.rowId, row: ('' + data)});
                    this.rowId++;
                    if (this.loraLogArray.length > this.maxLength) {
                        this.loraLogArray = this.loraLogArray.slice( -(this.maxLength - 1) );
                    }

                    this.logger.debug(`tcpServer received data`);

                    //this.logger.silly((this.rowId + ' DATA ' + sock.remoteAddress + ': ' + data).trim());
                }

            });
        });

        tcpServer.listen(port, host, () => {
            this.logger.verbose('Began to listening for LoRa logs on port ' + port +'.');
        });
    };


    getLog (loginToken) {
        //removeOldTokens
        this.removeOldTokens();
        if (this.loraLogArray.length < 1) {
            return []
        }

        if (this.lastRowIdForToken[loginToken] === undefined) {
            this.logger.debug('Get lora log first request.');
            this.lastRowIdForToken[loginToken] = this.loraLogArray[this.loraLogArray.length - 1].rowId;
            return this.loraLogArray
        } else {
            // Search for array item index of current user's row id
            const itemIndex = this.loraLogArray.findIndex((item) => item.rowId === this.lastRowIdForToken[loginToken])

            if (itemIndex < 0) {
                this.logger.debug('Get lora log too old request.');
                this.lastRowIdForToken[loginToken] = this.loraLogArray[this.loraLogArray.length - 1].rowId;
                return this.loraLogArray
            } else {
                this.logger.debug('Get new lora log fragment.');
                this.lastRowIdForToken[loginToken] = this.loraLogArray[this.loraLogArray.length - 1].rowId
                return this.loraLogArray.slice( itemIndex + 1 );
            }
        }
    }
}

exports.LoraLogger = LoraLogger
