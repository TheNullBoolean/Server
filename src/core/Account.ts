import { JsonManager } from "./util/JsonManager";

export interface IAccountData {
  id: string;
  nickname: string;
  email: string;
  password: string;
  wipe: boolean;
  edition: string;
}

export class Account {

  data: IAccountData = {
    id: '1',
    nickname: 'user',
    email: 'user@jet.com',
    password: 'password',
    wipe: true,
    edition: 'eod',
  }

  // Defaults
  
  constructor(data: IAccountData) {
    Object.assign(this.data, data);
  }

  get id() {
    return this.data.id;
  }

  get nickname() {
    return this.data.nickname;
  }

  get email() {
    return this.data.email;
  }

  get password() {
    return this.data.password;
  }

  get wipe(): boolean {
    return this.data.wipe;
  }

  set wipe(status: boolean) {
    this.data.wipe = status;
    this.save();
  }

  getPath() {
    return `user/profiles/${this.id}/`;
  }
  
  save() {
    const accounts = JsonManager.read("user/profiles.config.json");
    JsonManager.write("user/cache/res.json", {
      ...accounts,
      [this.id]: this.data,
    });
  }
  
}