const VERSION="1.0";

export function version(){
    return VERSION;
}

export function print(arr){
    const row_len = 16
    const arr_len = arr.length
    
    for(let i =0; i< arr_len; i++){
        if(i%row_len== 0 && i!== 0){
            process.stdout.write("\n")
        }
        process.stdout.write("0x")
        process.stdout.write(Buffer.from([arr[i]]).toString('hex'))
        process.stdout.write(" ")

    }
    process.stdout.write("\n")
}

export function parse(arr){
    console.log("parse()")
    if(arr.length<=0 || arr.length % 4 !== 0){
        console.error("Wrong length", arr.length)
        return
    }
    
}





