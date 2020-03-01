import { singleton, container } from "tsyringe";
import { JsonManager } from "./util/JsonManager";
import { Database } from "./Database";

@singleton()
export class Accounts {
  
  database: Database;
  accounts: any = {};
  
  constructor() {
    this.database = container.resolve(Database);
    
    this.accounts = JsonManager.read(this.database.user.profiles.list);
  }
  
  find(sessionID: string) {
    for (let accountId of Object.keys(this.accounts)) {
      let account = this.accounts[accountId];
      
      if (account.id === sessionID) {
        return account;
      }
    }
    
    return undefined;
  }
  
  isWiped(sessionID: string) {
    return this.accounts[sessionID].wipe;
  }
  
  setWipe(sessionID: string, state: boolean) {
    this.accounts[sessionID].wipe = state;
    this.save();
  }
  
  exists({ email, password }: { email: string, password: string }) {
    const account: any = Object.values(this.accounts).find((account: any) => account.email === email && account.password === password);
    return account ? account.id : 0;
  }
  
  getReservedNickname(sessionID: string) {
    return this.accounts[sessionID].nickname;
  }
  
  findID(data: any) {
    let buff = Buffer.from(data.token, 'base64');
    let text = buff.toString('ascii');
    let info = JSON.parse(text);
    let sessionID = this.exists(info);
    
    return sessionID.toString();
  }

  getPath(sessionID: string) {
    return `user/profiles/${sessionID}/`;
  }
  
  save() {
    JsonManager.write("user/cache/res.json", this.accounts);
  }
  
}