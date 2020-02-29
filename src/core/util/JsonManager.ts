import * as fs from 'fs';

export class JsonManager {
  public static createDir(file: string) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));
    
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  }
  
  public static parse(string: string) {
    return JSON.parse(string);
  }
  
  public static read(file: string) {
    return this.parse((fs.readFileSync(file, 'utf8')).replace(/[\r\n\t]/g, '').replace(/\s\s+/g, ''));
  }
  
  public static write(file: string, data: any) {
    this.createDir(file);
    fs.writeFileSync(file, JSON.stringify(data), 'utf8');
  }
}