import { singleton, container } from "tsyringe";
import { Settings } from "../Settings";
import { JsonManager } from "../util/JsonManager";
import { Database } from "../Database";
import { Logger } from "../util/Logger";
import { getRandomInt } from "../util";

@singleton()
export class Location {
  settings: Settings;
  database: Database;
  logger: Logger;
  
  locations: any = {};
  
  constructor() {
    this.settings = container.resolve(Settings);
    this.database = container.resolve(Database);
    this.logger = container.resolve(Logger);
    
  }
  
  init() {
    this.logger.logWarning("Loading locations into RAM...");
    
    for (let locationName in this.database.locations) {
      let node = this.database.locations[locationName];
      let location = JsonManager.read(node.base);
      
      // set infill locations
      for (let entry in node.entries) {
        location.SpawnAreas.push(JsonManager.read(node.entries[entry]));
      }
      
      // set exfill locations
      for (let exit in node.exits) {
        location.exits.push(JsonManager.read(node.exits[exit]));
      }
      
      // set scav locations
      for (let wave in node.waves) {
        location.waves.push(JsonManager.read(node.waves[wave]));
      }
      
      // set boss locations
      for (let spawn in node.bosses) {
        location.BossLocationSpawn.push(JsonManager.read(node.bosses[spawn]));
      }
      
      this.locations[locationName] = location;
    }
  }
  
  /* generates a random location preset to use for local session */
  generate(locationName: string) {
    let output = this.locations[locationName];
    let ids: any = {};
    let base: any = {};
    
    // don't generate loot on hideout
    if (locationName === "hideout") {
      return output;
    }
    
    // forced loot
    base = this.database.locations[locationName].loot.forced;
    for (let dir in base) {
      for (let loot in base[dir]) {
        let data = JsonManager.read(base[dir][loot]);
        
        if (data.Id in ids) {
          continue;
        } else {
          ids[data.Id] = true;
        }
        
        output.Loot.push(data);
      }
    }
    
    // static loot
    base = this.database.locations[locationName].loot.static;
    
    for (let dir in base) {
      let node = base[dir];
      let keys = Object.keys(node);
      let data = JsonManager.read(node[keys[getRandomInt(0, keys.length - 1)]]);
      
      if (data.Id in ids) {
        continue;
      } else {
        ids[data.Id] = true;
      }
      
      output.Loot.push(data);
    }
    
    // dyanmic loot
    let dirs = Object.keys(this.database.locations[locationName].loot.dynamic);
    let max = output.Loot.length + dirs.length;
    
    // This "as any" is a weird type hack, fix this later
    if ((this.settings.gameplay.locationloot as any)[locationName] < max) {
      max = (this.settings.gameplay.locationloot as any)[locationName];
    }
    
    base = this.database.locations[locationName].loot.dynamic;
    
    while (output.Loot.length < max) {
      let node = base[dirs[getRandomInt(0, dirs.length - 1)]];
      let keys = Object.keys(node);
      let data = JsonManager.read(node[keys[getRandomInt(0, keys.length - 1)]]);
      
      if (data.Id in ids) {
        continue;
      } else {
        ids[data.Id] = true;
      }
      
      output.Loot.push(data);
    }
    
    // done generating
    this.logger.logSuccess("Generated location " + locationName);
    return output;
  }

  /* get a location with generated loot data */
  get(location: string) {
    let locationName = location.toLowerCase().replace(" ", "");
    return JSON.stringify(this.generate(locationName));
  }
  
  /* get all locations without loot data */
  generateAll() {
    let base = JsonManager.read("db/cache/locations.json");
    let data = {};
    
    // use right id's and strip loot
    for (let locationName in this.locations) {
      let map = this.locations[locationName];
      
      map.Loot = [];
      (data as any)[(this.locations as any)[locationName]._Id] = map;
    }
    
    base.data.locations = data;
    return JSON.stringify(base);
  }
  
}