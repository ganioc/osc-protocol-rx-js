import * as dgram from "dgram"


const PORT = 12001;
const server = dgram.createSocket('udp4');


console.log("test server:", PORT)

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: msg from ${rinfo.address}:${rinfo.port}`);
    console.log(`${msg}`);
    console.log(Buffer.from(msg));
    // 2f 67 72 61 76 69 74 79
    // func_analyze(msg);

});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);

