import { singleton } from "tsyringe";
import { JsonManager } from "./util/JsonManager";

@singleton()
export class Settings {

  server!: Server;
  autosave!: Autosave;
  gameplay!: Gameplay;
  mods!: Mods;

  version = 'dev-r23.1';
  discord = 'https://www.discord.gg/jv7X8wC';
  
  constructor() {
    // Init our settings 
    Object.assign(this, JsonManager.read('user/server.config.json'));
  }

  save() {
    JsonManager.write("user/server.config.json", this);
  }

}

export interface ISettings {
  server: Server;
  autosave: Autosave;
  gameplay: Gameplay;
  mods: Mods;
}

interface Mods {
  list: List[];
}

interface List {
  name: string;
  author: string;
  version: string;
  enabled: boolean;
}

interface Gameplay {
  inraid: Inraid;
  bots: Bots;
  trading: Trading;
  location: Location;
  locationloot: Locationloot;
}

interface Locationloot {
  bigmap: number;
  develop: number;
  factory4_day: number;
  factory4_night: number;
  interchange: number;
  laboratory: number;
  rezervbase: number;
  shoreline: number;
  woods: number;
  hideout: number;
  lighthouse: number;
  privatearea: number;
  suburbs: number;
  tarkovstreets: number;
  terminal: number;
  town: number;
}

interface Location {
  realTimeEnabled: boolean;
  forceWeatherEnabled: boolean;
  forceWeatherId: number;
}

interface Trading {
  sellMultiplier: number;
  ragfairMultiplier: number;
  repairMultiplier: number;
  insureMultiplier: number;
  insureReturnChance: number;
  fenceAssortSize: number;
  buyItemsMarkedFound: boolean;
}

interface Bots {
  pmcEnabled: boolean;
  pmcSpawnChance: number;
  pmcUsecChance: number;
}

interface Inraid {
  saveLootEnabled: boolean;
  saveHealthEnabled: boolean;
  saveHealthMultiplier: number;
}

interface Autosave {
  saveOnExit: boolean;
  saveIntervalSec: number;
  saveOnReceive: boolean;
}

interface Server {
  ip: string;
  generateIp: boolean;
  httpsPort: number;
  eventPollIntervalSec: number;
  rebuildCache: boolean;
  backendUrl?: string;
}