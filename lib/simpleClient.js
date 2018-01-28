/*
 * Copyright (c) 2018. Yuriy Stul
 */
/*
See also https://blog.yld.io/2016/02/23/building-a-tcp-service-using-node-js/#.WmuEqYhuaHt
 */

'use strict';
const net = require('net');
const config = require('./config');

function runClient() {
    console.log('==>runClient()');
    const client = new net.Socket();
    client.setTimeout(1000, ()=>{
        console.log('socket timeout');
        client.end();
        client.destroy(); // kill client
    });

    client.connect(config.port, '127.0.0.1', function () {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');
    });

    client.on('data', (data) => {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response

        runClient()
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.log(`Error: ${err}`);
    })
}

module.exports = {
    runClient: runClient
};