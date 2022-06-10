import * as fs from "fs";

const jsonData = JSON.parse(fs.readFileSync('data/raw.json', 'utf-8'))

console.log("jsonData:")
console.log(jsonData)

const keys = Object.keys(jsonData);
console.log("keys:")
console.log(keys)

let data = {};

for(let key of keys){
    console.log("key:", key)
    console.log("val:", jsonData[key])
    data[key] = stringToHexArray(jsonData[key])
}
console.log("data:")
console.log(data)

fs.writeFileSync("data/data.json", JSON.stringify(data))

console.log("End")

function stringToHexArray(str){
    const arr = str.split(' ')
    // console.log(arr)
    const out = [];
    for(let strnum of arr){
        out.push(parseInt(strnum, 16));
        // out.push("0x" + strnum)
    }
    return out;
}