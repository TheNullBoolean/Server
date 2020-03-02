import { singleton, container } from "tsyringe";
import { Database } from "./Database";
import { JsonManager } from "./util/JsonManager";
import { Bots } from "./game/Bots";

export class Profile {
  
  sessionId: string;
  pmc: any;
  scav: any;
  database: Database;
  
  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.database = container.resolve(Database);

    this.pmc = JsonManager.read(this.getPath());
    this.generateScav();
  }

  private getPath(): string {
    return this.database.user.profiles.character.replace('__REPLACEME__', this.sessionId);
  }

  private generateScav(): void {
    let scavData = Bots.generatePlayerScav(this.sessionId);
    scavData._id = this.pmc.savage;
    scavData.aid = this.sessionId;

    this.scav = scavData;
  }
  
  public save(): void {
    JsonManager.write(this.getPath(), this.pmc);
  }
  
}