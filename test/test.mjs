//

// 2f 67 72 61 76 69 74 79 00 00 00 00 2c 66 66 66 00 00 00 00 bd 0c 42 82 be 3b be ba 41 1c e0 c6

// 2f 67 72 61 76 69 74 79 00 00 00 00 2c 66 66 66 00 00 00 00 bd 3f ac 15 be 3d 59 3c 41 1c e0 71

import { version, print, parse, arrIntToChar } from "../lib/osc.mjs"
import  {data } from "../data/data.mjs" 

console.log("Version:", version())

console.log("\ntest arrIntToChar")
const arr = [100,100,100]
console.log(arr)
console.log(arrIntToChar(arr))

console.log("\ntest print, parse")
print(data.msg1)
parse(data.msg1);

print(data.msg2);
parse(data.msg2);


