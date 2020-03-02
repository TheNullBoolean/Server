import { singleton, container } from "tsyringe";
import { Database } from "./Database";
import { Resources } from "./Resources";
import { Cache } from "./Cache";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { Account } from "./Account";
import { JsonManager } from "./util/JsonManager";

// This is the main core of our server, it handles the state of everything.

@singleton()
export class Server {

  cache: Cache;
  database: Database;
  settings: Settings;
  resources: Resources;

  // Accounts hash table
  accounts: {
    [key: string]: Account;
  } = {};

  // Profiles hash table
  profiles: {
    [key: string]: Profile;
  } = {};

  constructor() {
    this.cache = container.resolve(Cache);
    this.database = container.resolve(Database);
    this.settings = container.resolve(Settings);
    this.resources = container.resolve(Resources);

    // Load all accounts into this.accounts
    this.loadAccounts();
  }

  // Used to login to an existing account.
  // Loads profile data into memory if the account is found
  public login(token: string): string {
    let buff = Buffer.from(token, 'base64');
    let text = buff.toString('ascii');
    let { email, password }: { email: string, password: string } = JSON.parse(text);
    const account: Account | undefined = Object.values(this.accounts)
      .find((acc: Account) => acc.email === email && acc.password === password);

    if (account) {
      // The account exists, so we're going to return the ID for a new session,
      // we should also load the account profiles into memory at this point
      this.loadProfile(account.id);
      return account.id.toString();
    }

    return '0';
  }


  // Private Startup Functions
  private loadAccounts(): void {
    const accounts = JsonManager.read("user/profiles.config.json");
    Object.values(accounts).forEach((account: any) => {
      this.accounts[account.id] = new Account(account);
    });
  }

  private loadProfile(sessionId: string): void {
    this.profiles[sessionId] = new Profile(sessionId);
  }
  
}