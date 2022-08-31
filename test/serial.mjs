// to receive data from UART,
// const SerialPort = require('serialport') 
import { SerialPort } from "serialport"
import { print } from "../lib/osc.mjs"

const DEV = "/dev/tty.usbserial-142310"
const BAUDRATE = 115200

const STATE_IDLE = 0;
const STATE_TAG = 1;
const STATE_TAG2 = 2;
const STATE_DATA = 3;
const STATE_END = 4;
const STATE_END2 = 5;

const BUFFER_SIZE = 80;
let state = STATE_IDLE;
let buffer = Buffer.alloc(BUFFER_SIZE);
let index = 0;

const port = new SerialPort({
    path: DEV,
    baudRate: BAUDRATE
})

port.on('error', function (err) {
    console.log('Error: ', err.message)
})

port.on('data', function (data) {
    let ts = Date.now();
    console.log(ts)
    // console.log('Data:', data)
    // print(data)
    // console.log('ASCII:', data.toString())
    parse_serial(data)
})
function clean_buffer(){
    for(let i=0; i< BUFFER_SIZE; i++){
        buffer[i] = 0;
    }
}
function parse_serial(arr){
    console.log("parse()")
    
    for(let i=0; i< arr.length ; i++){
        switch(state){
            case STATE_IDLE :
                if(arr[i] == 'A'.charCodeAt(0)){
                    state = STATE_TAG;
                    clean_buffer();
                    buffer[index] = arr[i]
                    index++;
                }else{
                    index = 0
                }
                break;
            case STATE_TAG:
                if(arr[i] == ':'.charCodeAt(0)){
                    state = STATE_DATA;
                    buffer[index] = arr[i];
                    index++;
                }else{
                    state = STATE_IDLE;
                    index = 0;
                }
                break;
            case STATE_DATA:
                if(arr[i] == 0x0D){
                    state=STATE_END;

                }else{
                    buffer[index] = arr[i];
                    index++;
                }
                break;
            case STATE_END:
                if(arr[i] == 0x0A){
                    console.log("Received a complete packet:", index)
                    let buf = Buffer.alloc(index)
                    buffer.copy(buf,0,0, index)
                    // print(buf)
                    
                    handle_serial_data(buf)
                }
                state =  STATE_IDLE;
                index = 0;
        }
    }
}

function handle_serial_data(buf){
    console.log(buf.toString()) 
    let arr = buf.toString();
    let item_array =  arr.split(/\s+/)
    // console.log(item_array)
    const ACCx = 1;
    const ACCy = 2;
    const ACCz = 3;
    const MAGNETx = 5;
    const MAGNETy = 6;
    const MAGNETz = 7;

    console.log("Acceleratometer x: ", item_array[ACCx])
    console.log("Acceleratometer y: ", item_array[ACCy]) 
    console.log("Acceleratometer x: ", item_array[ACCz])

    console.log("Magnetometer x:", item_array[MAGNETx])
    console.log("Magnetometer y:", item_array[MAGNETy])
    console.log("Magnetometer x:", item_array[MAGNETz])    
}
