import * as fs from 'fs';
import { container } from 'tsyringe';
import { getDirList } from './util';
import { Logger } from './util/Logger';
import { Settings } from './Settings';
import { JsonManager } from './util/JsonManager';
import { Database } from './Database';
import { Resources } from './Resources';

export class Cache {
  
  logger: Logger;
  settings: Settings;
  db: Database;
  res: Resources;
  
  constructor() {
    this.logger = container.resolve(Logger);
    this.settings = container.resolve(Settings);
    this.db = container.resolve(Database);
    this.res = container.resolve(Resources);
    
    // Should we rebuild?
    let rebuild = false;
    
    /* check if loadorder is missing */
    if (!fs.existsSync("user/cache/loadorder.json")) {
      this.logger.logWarning("Loadorder mismatch");
      rebuild = true;
    }
    
    /* detect if existing mods changed */
    if (!rebuild && this.detectChangedMods()) {
      this.logger.logWarning("Modlist mismatch");
      rebuild = true;
    }
    
    /* check if db need rebuid */
    if (!rebuild && this.isRebuildRequired()) {
      this.logger.logWarning("Rebuild required");
      rebuild = true;
    }
    
    this.settings.server.rebuildCache = rebuild;
    
    /* rebuild db */
    if (rebuild) {
      this.logger.logWarning("Rebuilding routes");
      
      this.routeAll();
      this.detectMissingMods();
      this.loadAllMods();
      
      this.db.save();
      this.res.save();
      
      return;
    }
    
    this.db.load(JsonManager.read("user/cache/db.json"));
    this.res.load(JsonManager.read("user/cache/res.json"));
    
    this.detectMissingMods();
  }
  
  routeAll() {
    this.db.load(this.scanRecursiveRoute("db/"));
    this.res.load(this.scanRecursiveRoute("res/"));

    // We don't need loadorder anymore?
    // JsonManager.write("user/cache/loadorder.json", JsonManager.read("../src/loadorder.json"));
    
    /* add important server paths */
    this.db.user = {
      ...this.db.user,
      config: "user/server.config.json",
      events_schedule: "user/events/schedule.json"
    }
  }
  
  loadAllMods() {
    let modList = this.settings.mods.list;
    
    for (let element of modList) {
      if (!element.enabled) {
        this.logger.logWarning("Skipping mod " + element.author + "-" + element.name + "-" + element.version);
        continue;
      }
      
      let filepath = this.getModFilepath(element);
      let mod = JsonManager.read(filepath + "/mod.config.json");
      this.loadMod(mod, filepath);
    }
  }
  
  loadMod(mod: any, filepath: string) {
    this.logger.logInfo("Loading mod " + mod.author + "-" + mod.name + "-" + mod.version);
    
    // What's src? Assuming we use it to load in custom mod js
    // let src = JsonManager.read("user/cache/loadorder.json");
    
    console.log('TODO: Update loadMod()');
    
    if ("db" in mod) {
      this.scanRecursiveMod(filepath, this.db, mod.db);
      this.db.save();
    }
    
    if ("res" in mod) {
      this.scanRecursiveMod(filepath, this.res, mod.res);
      this.res.save();
    }
    
    // if ("src" in mod) {
    //     src = scanRecursiveMod(filepath, src, mod.src);
    //     json.write("user/cache/loadorder.json", src);
    // }
  }
  
  scanRecursiveMod(filepath: string, baseNode: any, modNode: any) {
    if (typeof modNode === "string") {
      baseNode = filepath + modNode;
    }
    
    if (typeof modNode === "object") {
      for (let node in modNode) {
        if (!(node in baseNode)) {
          baseNode[node] = {};
        }
        
        baseNode[node] = this.scanRecursiveMod(filepath, baseNode[node], modNode[node]);
      }
    }
    
    return baseNode;
  }
  
  scanRecursiveRoute(filepath: string) {
    let baseNode: any = {};
    let directories = getDirList(filepath);
    let files = fs.readdirSync(filepath);
    
    // remove all directories from files
    for (let directory of directories) {
      for (let file in files) {
        if (files[file] === directory) {
          files.splice(file as any, 1);
        }
      }
    }
    
    // make sure to remove the file extention
    for (let node in files) {
      let fileName = files[node].split('.').slice(0, -1).join('.');
      baseNode[fileName] = filepath + files[node];
    }
    
    // deep tree search
    for (let node of directories) {
      baseNode[node] = this.scanRecursiveRoute(filepath + node + "/");
    }
    
    return baseNode;
  }
  
  detectMissingMods() {
    if (!fs.existsSync("user/mods/")) {
      return;
    }
    
    let dir = "user/mods/";
    let mods = getDirList(dir);
    
    for (let mod of mods) {
      /* check if config exists */
      if (!fs.existsSync(`${dir}${mod}/mod.config.json`)) {
        this.logger.logError(`Mod ${mod} is missing mod.config.json`);
        this.logger.logError("Forcing server shutdown...");
        process.exit(1);
      }
      
      let config = JsonManager.read(`${dir}${mod}/mod.config.json`);
      let found = false;
      
      /* check if mod is already in the list */
      for (let installed of this.settings.mods.list) {
        if (installed.name === config.name) {
          this.logger.logInfo(`Mod ${mod} is installed`);
          found = true;
          break;
        }
      }
      
      /* add mod to the list */
      if (!found) {
        if (!config.version || config.files || config.filepaths) {
          this.logger.logError(`Mod ${mod} is out of date and not compatible with this version of EmuTarkov`);
          this.logger.logError('Forcing server shutdown...');
          process.exit(1);
        }
        
        this.logger.logWarning(`Mod ${mod} not installed, adding it to the modlist`);
        
        this.settings.mods.list.push({
          name: config.name,
          author: config.author,
          version: config.version, 
          enabled: true,
        });
        this.settings.server.rebuildCache = true;
        this.settings.save();
      }
    }
  }
  
  detectChangedMods() {
    let changed = false;
    
    for (let mod of this.settings.mods.list) {
      if (!fs.existsSync(`${this.getModFilepath(mod)}/mod.config.json`)) {
        changed = true;
        break;
      }
      
      let config = JsonManager.read(`${this.getModFilepath(mod)}/mod.config.json`);
      
      if (mod.name !== config.name || mod.author !== config.author || mod.version !== config.version) {
        changed = true;
        break;
      }
    }
    
    if (changed) {
      this.settings.mods.list = [];
    }
    
    return changed;
  }
  
  isRebuildRequired() {
    if (
      !fs.existsSync("user/cache/mods.json")
      || !fs.existsSync("user/cache/db.json")
      || !fs.existsSync("user/cache/res.json")
      || !fs.existsSync("user/cache/loadorder.json")
      ) {
        return true;
      }
      
      let modlist = this.settings.mods.list;
      let cachedlist = JsonManager.read("user/cache/mods.json");
      
      if (modlist.length !== cachedlist.length) {
        return true;
      }
      
      for (let mod in modlist) {
        /* check against cached list */
        if (modlist[mod].name !== cachedlist[mod].name
          || modlist[mod].author !== cachedlist[mod].author
          || modlist[mod].version !== cachedlist[mod].version
          || modlist[mod].enabled !== cachedlist[mod].enabled) {
            return true;
          }
        }
        
        return false;
      }
      
      // TODO: Strong type
      getModFilepath(mod: any) {
        return `user/mods/${mod.author}-${mod.name}-${mod.version}`;
      }
      
    }