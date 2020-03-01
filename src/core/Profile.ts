import { singleton, container } from "tsyringe";
import { Database } from "./Database";
import { JsonManager } from "./util/JsonManager";

// TODO: Replace this with a typescript function or class
const generatePlayerScav = require('../../old/src/classes/bots');

@singleton()
export class Profiles {
  
  database: Database;
  profiles: any = {};
  
  constructor() {
    this.database = container.resolve(Database);
  }

  initializeProfile(sessionId: string) {
    this.profiles[sessionId] = {
      pmc: JsonManager.read(this.getPath(sessionId)),
      scav: 
    };
  }

  getPath(sessionId: string) {
    return this.database.user.profiles.character.replace('__REPLACEME__', sessionId);
  }

  getOpenSessions() {
    return Object.keys(this.profiles);
  }

  generateScav(sessionId: string) {
      let pmcData = this.profiles[sessionId].pmc;
      let scavData = generatePlayerScav();

      scavData._id = pmcData.savage;
      scavData.aid = sessionId;

      return scavData;
  }
  
  save(sessionId: string) {
    if (this.profiles[sessionId] && this.profiles[sessionId].pmc) {
      JsonManager.write(this.getPath(sessionId), this.profiles[sessionId].pmc);
    }
  }
  
}