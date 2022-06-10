// udp server

// const dgram = require('dgram');
import * as dgram from "dgram"
const server = dgram.createSocket('udp4');
const PORT=9000

const STATE_IDLE=0;
const STATE_ADDRESS=1
const STATE_TYPE=2
const STATE_ARG=3

console.log("hello")

// /gravity,fff

function add_to_types(types,type, len){
    types.push({type:type,length: len});
}
// function func_analyze(message){
//     var buf = Buffer.from(message);
//     var length = buf.length;
//     var address;
//     var type="";
//     var arg_num;
//     var position=0;
//     var position_component=0;
//     var state = STATE_IDLE;
//     var stay = true;
//     var types = [];/*
// 		     {
// 		     length:int,
// 		     type: string
// 		     }
// 		   */
//     var args = [];
//     console.log("buf length:" + length);
//     while(stay){
// 	switch(state){
// 	case STATE_IDLE:
// 	    if(buf[position] == '/'){
// 		state=STATE_ADDRESS;
// 		position_state=0;
// 	    }
// 	    position++;
// 	    break;
// 	case STATE_ADDRESS:
// 	    if(buf[position] == ','){
// 		state=STATE_TYPE;
// 		console.log("type:" +  type);
// 		position_component = 0;

// 	    }else if(buf[position] !== 0x00){
// 		type = type + hex2str(buf[position]);
// 	    }
// 	    position++;
// 	    break;
// 	case STATE_TYPE:
// 	    if(buf[position] == 'f'){
// 		console.log('f');
// 		add_to_types(types, 'f',4);
// 	    }else if(buf[position] == 'i'){
// 		console.log('i');
// 		add_to_types(types,'i',4);
// 	    }else if(buf[position] == 0x00){
// 		console.log('0');
// 	    }else{
// 		console.log("to args");
// 		position--;
// 		state=STATE_ARG;
// 	    }
// 	    position_component++;
// 	    position++;
// 	    break;
// 	case STATE_ARG:
	    
// 	    break;
// 	default:
// 	    console.err("error state");
// 	    process.exit(1);
// 	}
//     }
// }

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
