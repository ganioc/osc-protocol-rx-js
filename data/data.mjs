import * as fs from "fs";

const jsonData = JSON.parse(fs.readFileSync('data/data.json', 'utf-8'))
// console.log("jsonData:", jsonData)
export const data=jsonData;
