/*
 * Copyright (c) 2018. Yuriy Stul
 */
/*
See also https://blog.yld.io/2016/02/23/building-a-tcp-service-using-node-js/#.WmuEqYhuaHt
 */
'use strict';
const rl = require('readline');
const net = require('net');
const config = require('./config');

function runServer() {
    console.log(`Starting TCP service on localhost:${config.port}`);
    let messages = [];

    function addMessage(message) {
        messages.push(message)
    }

    function getMessage() {
        if (messages.length > 0) {
            let message = messages[0];
            messages.splice(0,1);
            return message;
        } else {
            return null;
        }
    }

    let prompts = rl.createInterface(process.stdin, process.stdout);

    prompts.on('line', line => {
        if (!line || line.length === 0)
            process.exit();
        addMessage(line)
    });

    const server = net.createServer();
    server.on('connection', handleConnection);

    function handleConnection(connection) {
        let remoteAddress = connection.remoteAddress + ":" + connection.remotePort;
        console.log(`New client connection from  ${remoteAddress}`);

        connection.setEncoding('utf8');

        connection.on('error', onConnectionError);

        function onConnectionError(err) {
            console.log(`Connection error ${err.message}`);
        }

        let message = getMessage();
        if (message) {
            console.log(`Send message ${message}`);
            connection.write(message);
        }
    }

    server.listen(config.port, () => {
        console.log('Server listening to %j', server.address());
    })
}

module.exports = {
    runServer: runServer
};
