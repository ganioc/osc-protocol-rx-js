import * as dgram from "dgram"


const PORT=12001;
const HOST="127.0.0.1";


console.log("test server:", PORT)

var client = dgram.createSocket('udp4');

const send = (buf)=>{
    return new Promise(resolve =>{
        client.send(buf,0,buf.length, PORT,HOST,(err)=>{
            resolve()
        })
    })
}

async function main(){
    await send(Buffer.from("hello"))
    client.close();
}

main();

