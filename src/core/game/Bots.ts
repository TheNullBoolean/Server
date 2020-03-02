import { getRandomIntEx, generateNewItemId, getRandomInt } from "../util";
import { JsonManager } from "../util/JsonManager";
import { container } from "tsyringe";
import { Database } from "../Database";
import { Server } from "../Server";
import { Settings } from "../Settings";

// This is a static class with helper functions
// TODO: Rewrite this... this class is REALLLLLY BAD

export class Bots {
  public static generate(info: any, sessionId: string) {
    const database = container.resolve(Database);
    let generatedBots = []; 
  
    for (let condition of info.conditions) {
      for (let i = 0; i < condition.Limit; i++)  {
        let bot = JsonManager.read(database.bots.base);
  
        bot._id = "bot" + getRandomIntEx(99999999);
        bot.Info.Settings.BotDifficulty = condition.Difficulty;
        bot = this.generateBot(bot, condition.Role, sessionId);
        generatedBots.unshift(bot);
      }
    }
  
    return generatedBots;
  }

  public static generateBot(bot: any, role: any, sessionId: string) {
    const settings = container.resolve(Settings);
    const database = container.resolve(Database);

    let type = (role === "cursedAssault") ? "assault" : role;
    let node: any = {};
  
    // chance to spawn simulated PMC players
    if ((type === "assault" || type === "marksman" || type === "pmcBot") && settings.gameplay.bots.pmcEnabled) {
      let spawnChance = getRandomInt(0, 99);
      let sideChance = getRandomInt(0, 99);
  
      if (spawnChance < settings.gameplay.bots.pmcSpawnChance) {
        if (sideChance < settings.gameplay.bots.pmcUsecChance) {
          bot.Info.Side = "Usec";
          type = "usec";
        } else {
          bot.Info.Side = "Bear";
          type = "bear";
        }
  
        bot.Info.Level = getRandomInt(1, 70);
      }
    }
  
    // we don't want player scav to be generated as PMC
    if (role === "playerScav") {
      type = "assault";
    }
  
    // generate bot
    node = database.bots[type.toLowerCase()];
  
    bot.Info.Settings.Role = role;
    bot.Info.Nickname = this.getRandomValue(node.names);
    bot.Info.Settings.Experience = this.getRandomValue(node.experience);
    bot.Info.Voice = this.getRandomValue(node.appearance.voice);
    bot.Health = this.getRandomValue(node.health);
    bot.Customization.Head = this.getRandomValue(node.appearance.head);
    bot.Customization.Body = this.getRandomValue(node.appearance.body);
    bot.Customization.Feet = this.getRandomValue(node.appearance.feet);
    bot.Customization.Hands = this.getRandomValue(node.appearance.hands);
    bot.Inventory = this.getRandomValue(node.inventory);
  
    // add dogtag to PMC's		
    if (type === "usec" || type === "bear") {
      bot = this.addDogtag(bot, sessionId);
    }
    
    return bot;
  }

  public static addDogtag(bot: any, sessionId: string) {
    const server = container.resolve(Server);
    
    let weaponArray = [
      'A Magical Force',
      'Goose With A Knife',
      'Spartan Laser',
      'Smashed Vodka Bottle',
      'Heart Attack',
      'Arrow To The Knee'
    ];
    let randomNumber = Math.floor(Math.random()*weaponArray.length);
    
    let pmcData = server.profiles[sessionId].pmc;
    let dogtagItem = {
      _id: generateNewItemId(),
      _tpl: ((bot.Info.Side === 'Usec') ? "59f32c3b86f77472a31742f0" : "59f32bb586f774757e1e8442"),
      parentId: bot.Inventory.equipment,
      slotId: "Dogtag",
      upd: {
        "Dogtag": {
          "Nickname": bot.Info.Nickname,
          "Side": bot.Info.Side,
          "Level": bot.Info.Level,
          "Time": (new Date().toISOString()),
          "Status": "Killed by ",
          "KillerName": pmcData.Info.Nickname,
          "WeaponName": weaponArray[randomNumber]
        }
      }
    }
  
    bot.Inventory.items.push(dogtagItem);
    return bot;
  }

  public static generatePlayerScav(sessionId: string) {
    let scavData = this.generate({
      conditions: [
        {
          Role: 'playerScav',
          Limit: 1,
          Difficulty: 'normal'
        }
      ]
    }, sessionId);

    scavData[0].Info.Settings = {};
    return scavData[0];
  }

  public static getRandomValue(node: any) {
    let keys = Object.keys(node);
    return JsonManager.read(node[keys[getRandomInt(0, keys.length - 1)]]);
  }
}