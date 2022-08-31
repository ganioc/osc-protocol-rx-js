const VERSION="1.0";

export function version(){
    return VERSION;
}

export function print(arr){
    const row_len = 8
    const arr_len = arr.length

    console.log("print():", arr_len)
    
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
function formInt(num1, num2, num3, num4){
    let num = Buffer.from([num1, num2, num3, num4])
    return num.readInt32BE(0);
}
function formFloat(num1, num2,num3,num4){
    let num = Buffer.from([num1, num2, num3, num4])
    return num.readFloatBE(0)   
}
export function arrIntToChar(arr){
    return arr.map((item)=>{
        return String.fromCharCode(item)
    })
}
export function parse(arr){
    console.log("parse()")
    if(arr.length<=0 || arr.length % 4 !== 0){
        console.error("Wrong length", arr.length)
        return
    }

    const STATE_IDLE = 0
    const STATE_TAG = 1
    const STATE_TYPE = 2
    const STATE_ARGS = 3
    const STATE_END = 4
    let b_stay = true
    let state = STATE_IDLE
    let index = 0;
    let args_index = 0;
    let tag = ""
    let types = [];
    let args = [];

    while(b_stay){
        switch(state){
            case STATE_IDLE: 
                if(arr[index] == '/'.charCodeAt(0)){
                    state = STATE_TAG;
                }
                index++;
            break;
            case STATE_TAG:
                if(arr[index] !== 0x0){
                    tag = tag + String.fromCharCode(arr[index])
                }else if((index + 1)%4==0 &&  arr[index+1] == ','.charCodeAt(0)){
                    state = STATE_TYPE;
                    index++;
                    console.log("tag:", tag)
                } 
                index++;
            break;
            case STATE_TYPE:
                if(arr[index] == 'f'.charCodeAt(0) || arr [index] == 'i'.charCodeAt(0)){
                    types.push(arr[index])
                }else if((index+1)%4==0 && arr[index+1] !== 0x0){
                    state = STATE_ARGS;
                    console.log("types:", arrIntToChar(types))
                }
                index++;
            break;
            case STATE_ARGS:
                if(args_index == types.length){
                    state = STATE_END
                }else if(types[args_index] == 'f'.charCodeAt(0)){
                    args.push(formFloat(arr[index],
                            arr[index+1],
                            arr[index+2],
                            arr[index+3]))
                    args_index++;
                }else if(types[args_index] == 'i'.charCodeAt(0)){
                    args.push(formInt(arr[index],
                            arr[index+1],
                            arr[index+2],
                            arr[index+3]))
                    args_index++;
                }
                index= index+4
            break;
            case STATE_END:
                // console.log("End")
                console.log(args);
                b_stay = false;
            break;
            default :
            console.error("Wrong state: ", state)
            b_stay=false
            break;
        }
    }
}





