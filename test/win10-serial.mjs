// wserial, win10 serial
import { SerialPort } from "serialport"
import * as dgram from "dgram"

console.log("Hello win10-serial")

const DEV = "COM16"
const BAUDRATE = 115200
const PORT = 12000;
const HOST = "192.168.0.101";

process.on('SIGINT', () => {
    console.log("quit")
    process.exit()
})
var client = dgram.createSocket('udp4');

const send = (buf) => {
    return new Promise(resolve => {
        client.send(buf, 0, buf.length, PORT, HOST, (err) => {
            resolve()
        })
    })
}
const port = new SerialPort({
    path: DEV,
    baudRate: BAUDRATE
})
port.on('error', function (err) {
    console.log('Error: ', err.message)
})
port.on('data', async function (data) {
    let ts = Date.now();
    console.log(ts);

    console.log(data);
    parse_serial(data)
})

const STATE_IDLE = 0;
const STATE_TAG = 1;
const STATE_TAG1 = 10;
const STATE_TAG2 = 2;
const STATE_TAG3 = 20;
const STATE_DATA1 = 3;
const STATE_DATA2 = 30;
const STATE_DATA3 = 31;
const STATE_END = 4;


const BUFFER_SIZE = 100;
let state = STATE_IDLE;
let buffer = Buffer.alloc(BUFFER_SIZE);
let index = 0;

let acc_x = [];
let acc_y = [];
let acc_z = [];


function clean_buffer() {
    for (let i = 0; i < BUFFER_SIZE; i++) {
        buffer[i] = 0;
    }
    index = 0
}
// ACC: 478 -512 16651
function parse_serial(arr) {

    console.log("parse()")
    console.log(arr.toString())

    console.log("size:", arr.length);
    for (let i = 0; i < arr.length; i++) {
        // console.log(i, arr[i])
        switch (state) {
            case STATE_IDLE:
                if (arr[i] == 0x41) {
                    state = STATE_TAG;
                }
                break;
            case STATE_TAG:
                if (arr[i] == 0x43) {
                    state = STATE_TAG1;
                } else {
                    state = STATE_IDLE;
                }
                break;
            case STATE_TAG1:
                if (arr[i] == 0x43) {
                    state = STATE_TAG2;
                }
                else {
                    state = STATE_IDLE;
                }
                break;
            case STATE_TAG2:
                if (arr[i] == 0x3a) {
                    state = STATE_TAG3;
                }
                else { state = STATE_IDLE }
                break;
            case STATE_TAG3:
                if (arr[i] == 0x20) {
                    state = STATE_DATA1;
                    clean_buffer();
                } else {
                    state = STATE_IDLE;
                }
                break;
            case STATE_DATA1:
                buffer[index] = arr[i];
                index++;

                if (arr[i] == 0x20) {
                    state = STATE_DATA2;
                }
                break;
            case STATE_DATA2:
                buffer[index] = arr[i];
                index++;

                if (arr[i] == 0x20) {
                    state = STATE_DATA3;
                }
                break;
            case STATE_DATA3:
                if (arr[i] == 0x0d && arr[i + 1] == 0x0a) {
                    state = STATE_END;
                }else{
                    buffer[index] = arr[i];
                    index++;
                }

                break;
            case STATE_END:
                console.log("received a complete packet", index);
                let buf = Buffer.alloc(index)
                buffer.copy(buf, 0, 0, index);

                handle_serial_data(buf)
                state = STATE_IDLE;
                break;
            default:
                console.log("Wrong state")
        }
    }
}
async function handle_serial_data(buf) {
    console.log("handle_serial_data()")
    console.log(buf)
    console.log(buf.toString())
    let arr = buf.toString()
    console.log("===========================")
    let item_array = arr.split(/\s+/)
    console.log(item_array)
    const ACCx = 0;
    const ACCy = 1;
    const ACCz = 2;

    console.log("Acceleratometer x: ", item_array[ACCx] + 0)
    console.log("Acceleratometer y: ", item_array[ACCy] + 0) 
    console.log("Acceleratometer x: ", item_array[ACCz] + 0)

    let filtered_ACCx = parseFloat(item_array[ACCx])
    let filtered_ACCy = parseFloat(item_array[ACCy])
    let filtered_ACCz = parseFloat(item_array[ACCz])

    console.log("typeof ACCx",typeof(filtered_ACCx))

    // generate acce packet of OSC message,
    let acceMsg = createACCMsg(filtered_ACCx,
        filtered_ACCy,
        filtered_ACCz);

    console.log(acceMsg);
    client.send(acceMsg,0,acceMsg.length, PORT,HOST)
}
function createFloat32Msg(num1, num2, num3){
    let bufNum1 = Buffer.alloc(4);
    bufNum1.writeFloatBE(num1)
    let bufNum2 = Buffer.alloc(4);
    bufNum2.writeFloatBE(num2)
    let bufNum3 = Buffer.alloc(4);
    bufNum3.writeFloatBE(num3)
    return Buffer.concat([bufNum1, bufNum2, bufNum3])
}
function createACCMsg(num1, num2, num3){
    let bufTAG = Buffer.from([
        0x2f ,0x61 ,0x63 ,0x63 ,0x65 ,0x6c ,0x65 ,0x72,
        0x6f ,0x6d ,0x65 ,0x74 ,0x65 ,0x72 ,0x00 ,0x00   ])
    let bufType =  Buffer.from([
        0x2c ,0x66 ,0x66 ,0x66 ,0x00 ,0x00 ,0x00 ,0x00])
    let bufNum = createFloat32Msg(num1, num2, num3)

    return Buffer.concat([bufTAG, bufType, bufNum])
}