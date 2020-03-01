import { singleton, container } from "tsyringe";
import { Settings } from "../Settings";
import { JsonManager } from "../util/JsonManager";
import { Database } from "../Database";
import { getRandomInt, getTime, getDate } from "../util";

@singleton()
export class Weather {
  settings: Settings;
  database: Database;
  weather: any;
  
  constructor() {
    this.settings = container.resolve(Settings);
    this.database = container.resolve(Database);

    this.weather = JsonManager.read(this.database.user.cache.weather);
  }
  
  generate() {
    let output: any = {};
    
    // set weather
    if (this.settings.gameplay.location.forceWeatherEnabled) {
      output = this.weather.data[this.settings.gameplay.location.forceWeatherId];
    } else {
      output = this.weather.data[getRandomInt(0, this.weather.data.length - 1)];
    }
    
    // replace date and time
    if (this.settings.gameplay.location.realTimeEnabled) {
      let time = getTime().replace("-", ":").replace("-", ":");
      let date = getDate();
      let datetime = date + " " + time;
      
      output.weather = {};
      output.weather.timestamp = Math.floor((+new Date()) / 1000);
      output.weather.date = date;
      output.weather.time = datetime;
      output.date = date;
      output.time = time;
    }
    
    return output;
  }
  
}