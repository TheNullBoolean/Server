"use strict";

const fs = require('fs');
const os = require('os');
const path = require('path');
const adler32 = require('adler32');

export function clearString(string: string) {
	return string.replace(/[\r\n\t]/g, '').replace(/\s\s+/g, '').replace(/[\\]/g, "");
}

export function adlerGen(string: string){
	return adler32.sum(string);
}

export function getRandomInt(min = 0, max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (max > min) ? Math.floor(Math.random() * (max - min + 1) + min) : min;
}

export function getRandomIntEx(max: number) {
    return (max > 1) ? Math.floor(Math.random() * (max - 2) + 1) : 1;
}

export function getDirList(path: string) {
    return fs.readdirSync(path).filter((file: File) => {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

export function removeDir(dir: string) {
  fs.readdirSync(dir).forEach((file: File) => {
    let curPath = path.join(dir, file);

    if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
    } else {
        fs.unlinkSync(curPath);
    }
  })

  fs.rmdirSync(dir);
}

export function getTimestamp() {
    let time = new Date();

    return Math.floor(time.getTime() / 1000);
}

export function getTime() {
    let today = new Date();
    let hours = ("0" + today.getHours()).substr(-2);
    let minutes = ("0" + today.getMinutes()).substr(-2);
    let seconds = ("0" + today.getSeconds()).substr(-2);

    return hours + "-" + minutes + "-" + seconds;
}

export function getDate() {
    let today = new Date();
    let day = ("0" + today.getDate()).substr(-2);
    let month = ("0" + (today.getMonth() + 1)).substr(-2);

    return today.getFullYear() + "-" + month + "-" + day;
}

export function makeSign(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

export function generateNewAssortId() {
    return generateNewId("A");
}

export function generateNewItemId() {
    return generateNewId("I");
}

export function generateNewDialogueId() {
    return generateNewId("D");
}

export function generateNewId(prefix: string) {
    let getTime = new Date();
    let month = getTime.getMonth().toString();
    let date = getTime.getDate().toString();
    let hour = getTime.getHours().toString();
    let minute = getTime.getMinutes().toString();
    let second = getTime.getSeconds().toString();
    let random = getRandomInt(1000000000, 9999999999).toString();
    let retVal = prefix + (month + date + hour + minute + second + random).toString();
    let sign = makeSign(24 - retVal.length).toString();
    
    return retVal + sign;
}

export function getLocalIpAddress() {
    let address = "127.0.0.1";
    let ifaces = os.networkInterfaces();

    for (let dev in ifaces) {
        let iface = ifaces[dev].filter(function (details: any) {
            return details.family === 'IPv4' && details.internal === false;
        });

        if (iface.length > 0) {
            address = iface[0].address;
        }
    }

    return address;
}

// export function watermark() {
//     let text_1 = "EmuTarkov " + server.version;
//     let text_2 = "https://www.discord.gg/jv7X8wC";
//     let diffrence = Math.abs(text_1.length - text_2.length);
//     let whichIsLonger = ((text_1.length >= text_2.length) ? text_1.length : text_2.length);
//     let box_spacing_between_1 = "";
//     let box_spacing_between_2 = "";
//     let box_width = "";

//     /* calculate space */
//     if (text_1.length >= text_2.length) {
//         for (let i = 0; i < diffrence; i++) {
//             box_spacing_between_2 += " ";
//         }
//     } else {
//         for (let i = 0; i < diffrence; i++) {
//             box_spacing_between_1 += " ";
//         }
//     }

//     for (let i = 0; i < whichIsLonger; i++) {
//         box_width += "═";
//     }

//     /* reset cursor to begin */
//     process.stdout.write('\u001B[2J\u001B[0;0f');

//     /* show watermark */
//     logger.logRequest("╔═" + box_width + "═╗");
//     logger.logRequest("║ " + text_1 + box_spacing_between_1 + " ║");
//     logger.logRequest("║ " + text_2 + box_spacing_between_2 + " ║");
//     logger.logRequest("╚═" + box_width + "═╝");

//     /* set window name */
//     process.title = text_1;
// }