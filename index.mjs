// udp server

// const dgram = require('dgram');
import * as dgram from "dgram"
import { print as printMsg, parse as parseMsg } from "./lib/osc.mjs"

const server = dgram.createSocket('udp4');
const PORT=9000

console.log("hello")

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: msg from ${rinfo.address}:${rinfo.port}`);
    //console.log(`${msg}`);
    console.log(Buffer.from(msg));
    // 2f 67 72 61 76 69 74 79
    // func_analyze(msg);
	printMsg(msg)
	parseMsg(msg)

});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);
