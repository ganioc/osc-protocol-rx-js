//

// 2f 67 72 61 76 69 74 79 00 00 00 00 2c 66 66 66 00 00 00 00 bd 0c 42 82 be 3b be ba 41 1c e0 c6

// 2f 67 72 61 76 69 74 79 00 00 00 00 2c 66 66 66 00 00 00 00 bd 3f ac 15 be 3d 59 3c 41 1c e0 71

import { version, print, parse } from "../lib/osc.mjs"
import  {data } from "../data/data.mjs" 

// var msg1=[0x2f ,0x67 ,0x72 ,0x61 ,0x76 ,0x69 ,0x74 ,0x79 ,0x00 ,0x00 ,0x00 ,0x00 ,0x2c ,0x66 ,0x66 ,0x66 ,0x00 ,0x00 ,0x00 ,0x00 ,0xbd ,0x3f ,0xac ,0x15 ,0xbe ,0x3d ,0x59 ,0x3c ,0x41 ,0x1c ,0xe0 ,0x71];

console.log("Version:", version())
// console.log(testdata)
// console.log("data msg1:",testdata["msg1"])
// console.log("msg1:", data.msg1)
// console.log("msg2:", data.msg2);
print(data.msg2);
print(data.msg1)

parse(data.msg1);
parse(data.msg2);


