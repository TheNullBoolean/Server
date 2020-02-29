import * as fs from "fs";
import { getDate, getTime } from ".";
import { format } from "util";
import { singleton } from "tsyringe";

@singleton()
export class Logger {

  frontColors: { [key: string]: string } = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };

  backColors: { [key: string]: string } = {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  };

  fileStream: any;

  constructor() {
    let file = getDate() + "_" + getTime() + ".log";
    let folder = "user/logs/";
    let filepath = folder + file;
    
    // create log folder
    if (!fs.existsSync(folder)) { +
      fs.mkdirSync(folder);
    }
    
    // create log file
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, '');
    }
    
    this.fileStream = fs.createWriteStream(filepath, { flags: 'w' });
  }
  
  log(data: string, colorFront = "", colorBack = "") {
    let setColors = "";
    colorFront !== "" ? setColors += this.frontColors[colorFront] : null;
    colorFront !== "" ? setColors += this.backColors[colorBack] : null;
    
    // print data
    if (colorFront !== "" || colorBack !== "") {
      console.log(setColors + data + "\x1b[0m");
    } else {
      console.log(data);
    }
    
    // write the logged data to the file
    this.fileStream.write(format(data) + '\n');
  }
  
  logError(text: string) {
    this.log("[ERROR] " + text, "white", "red");
  }
  
  logWarning(text: string) {
    this.log("[WARNING] " + text, "white", "yellow");
  }
  
  logSuccess(text: string) {
    this.log("[SUCCESS] " + text, "white", "green");
  }
  
  logInfo(text: string) {
    this.log("[INFO] " + text, "cyan", "black");
  }
  
  logRequest(text: string) {
    this.log(text, "cyan", "black");
  }
  
  logData(data: any) {
    this.log(data);
  }
}
