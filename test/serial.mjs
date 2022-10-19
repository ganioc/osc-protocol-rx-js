// to receive data from UART,
// const SerialPort = require('serialport') 
import { SerialPort } from "serialport"
// import { print } from "../lib/osc.mjs"

import * as dgram from "dgram"
// import * as fs from "fs"
import { KalmanFilter } from "../lib/kalman.mjs";

const PORT=12000;
const HOST="127.0.0.1";

const DEV = "/dev/tty.usbserial-142310"
const BAUDRATE = 115200

const STATE_IDLE = 0;
const STATE_TAG = 1;
// const STATE_TAG2 = 2;
const STATE_DATA = 3;
const STATE_END = 4;
// const STATE_END2 = 5;

const BUFFER_SIZE = 80;
let state = STATE_IDLE;
let buffer = Buffer.alloc(BUFFER_SIZE);
let index = 0;

let acc_x=[];
let acc_y=[];
let acc_z=[];
let mag_x=[];
let mag_y=[];
let mag_z=[];

// Kalman filter parameters
const R=0.025
const Q=10

const filterAccX = new KalmanFilter( R,Q,1,0,1.0);
const filterAccY = new KalmanFilter( R,Q,1,0,1.0);
const filterAccZ = new KalmanFilter( R,Q,1,0,1.0);
const filterMagX = new KalmanFilter( R,Q,1,0,1.0);
const filterMagY = new KalmanFilter( R,Q,1,0,1.0);
const filterMagZ = new KalmanFilter( R,Q,1,0,1.0);

process.on('SIGINT', ()=>{
    console.log("Exit ctrl-c")
    // save to file
    const PATH="./data/LSM303DLHC/"
    const DATE=new Date()
    const name = "" + DATE.getDay()+DATE.getHours()+"-" + DATE.getMinutes() + "-" +
        +DATE.getSeconds()

    // fs.writeFileSync(PATH+"acc_x"+name+".json", JSON.stringify(acc_x).replace(/"/g,""))
    // fs.writeFileSync(PATH+"acc_y"+name+".json", JSON.stringify(acc_y).replace(/"/g,""))
    // fs.writeFileSync(PATH+"acc_z"+name+".json", JSON.stringify(acc_z).replace(/"/g,""))
    // fs.writeFileSync(PATH+"mag_x"+name+".json", JSON.stringify(mag_x).replace(/"/g,""))
    // fs.writeFileSync(PATH+"mag_y"+name+".json", JSON.stringify(mag_y).replace(/"/g,""))
    // fs.writeFileSync(PATH+"mag_z"+name+".json", JSON.stringify(mag_z).replace(/"/g,""))

    console.log("Saved to ", PATH, name)
    process.exit()
})

var client = dgram.createSocket('udp4');

const send = (buf)=>{
    return new Promise(resolve =>{
        client.send(buf,0,buf.length, PORT,HOST,(err)=>{
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

async function handle_serial_data(buf){
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
    
    acc_x.push(item_array[ACCx])
    acc_y.push(item_array[ACCy])
    acc_z.push(item_array[ACCz])
    mag_x.push(item_array[MAGNETx])
    mag_y.push(item_array[MAGNETy])
    mag_z.push(item_array[MAGNETz])

    let filtered_ACCx = filterAccX.filter(item_array[ACCx])
    let filtered_ACCy = filterAccY.filter(item_array[ACCy])
    let filtered_ACCz = filterAccZ.filter(item_array[ACCz])


    console.log("Filtered ACC x: ", filtered_ACCx)
    console.log("Filtered ACC y: ", filtered_ACCy) 
    console.log("Filtered ACC x: ", filtered_ACCz)

    // generate acce packet of OSC message,
    let acceMsg = createACCMsg(filtered_ACCx,
        filtered_ACCy,
        filtered_ACCz);

    console.log(acceMsg);
    // await send(acceMsg)
    client.send(acceMsg,0,acceMsg.length, PORT,HOST)

    // generate magnet packet of OSC message,
    let filtered_MAGx = filterMagX.filter(item_array[MAGNETx])
    let filtered_MAGy = filterMagY.filter(item_array[MAGNETy])
    let filtered_MAGz = filterMagZ.filter(item_array[MAGNETz])

    console.log("filtered MAG x:", filtered_MAGx)
    console.log("filtered MAG y:", filtered_MAGy)
    console.log("filtered MAG x:", filtered_MAGz) 

    let magnetMsg = createMAGNETMsg(filtered_MAGx,
        filtered_MAGy,
        filtered_MAGz);

    console.log(magnetMsg);
    // await send(magnetMsg)
    client.send(magnetMsg,0,magnetMsg.length, PORT,HOST)

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
// return a buffer, n*4 bytes
function createACCMsg(num1, num2, num3){
    let bufTAG = Buffer.from([
        0x2f ,0x61 ,0x63 ,0x63 ,0x65 ,0x6c ,0x65 ,0x72,
        0x6f ,0x6d ,0x65 ,0x74 ,0x65 ,0x72 ,0x00 ,0x00   ])
    let bufType =  Buffer.from([
        0x2c ,0x66 ,0x66 ,0x66 ,0x00 ,0x00 ,0x00 ,0x00])
    let bufNum = createFloat32Msg(num1, num2, num3)

    return Buffer.concat([bufTAG, bufType, bufNum])
}
function createMAGNETMsg(num1, num2, num3){
    let bufTAG = Buffer.from([
        0x2f, 0x6d, 0x61, 0x67 ,0x6e, 0x65, 0x74, 0x69, 
        0x63, 0x66, 0x69, 0x65, 0x6c, 0x64, 0x00, 0x00,  ])
    let bufType =  Buffer.from([
        0x2c ,0x66 ,0x66 ,0x66 ,0x00 ,0x00 ,0x00 ,0x00])
    let bufNum = createFloat32Msg(num1, num2, num3)

    return Buffer.concat([bufTAG, bufType, bufNum])
}