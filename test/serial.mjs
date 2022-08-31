// to receive data from UART,
// const SerialPort = require('serialport') 
import { SerialPort } from "serialport"

const DEV = "/dev/tty.usbserial-142310"
const BAUDRATE = 115200


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
    console.log('Data:', data)
    console.log('ASCII:', data.toString())
})