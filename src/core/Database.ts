import { singleton } from "tsyringe";
import { JsonManager } from "./util/JsonManager";

@singleton()
export class Database {

  // TODO: Move these types out to a types file
  // TODO: Finish writing these types...

  globals!: string;
  assort!: {
    [key: string]: any;
  }
  bots!: {
    [key: string]: any;
  }
  cache!: {
    assort: string;
    bots: string;
    customization: string;
    hideout_areas: string;
    hideout_production: string;
    hideout_scavcase: string;
    items: string;
    languages: string;
    locale: string;
    locations: string;
    quests: string;
    templates: string;
    traders: string;
    weather: string;
  }
  customization!: {
    [key: string]: string;
  }
  dialogues!: {
    [key: string]: string;
  }
  hideout!: {
    settings: string;
    areas: {
      [key: string]: string;
    }
    production: {
      [key: string]: string;
    }
    scavcase: {
      [key: string]: string;
    }
  }
  items!: {
    [key: string]: string;
  }
  locales!: any;
  locations!: any;
  profile!: {
    storage: string;
    character: {
      eod_bear: string;
      eod_usec: string;
      lbd_bear: string;
      lbd_usec: string;
      pte_bear: string;
      pte_usec: string;
      std_bear: string;
      std_usec: string;
    }
  }
  quests!: {
    [key: string]: string;
  }
  ragfair!: {
    offer: string;
    search: string;
  }
  templates!: {
    categories: {
      [key: string]: string;
    }
    items: {
      [key: string]: string;
    }
  }
  traders!: {
    [key: string]: string;
  }
  weather!: {
    fog: string;
    heavyclouds: string;
    heavyrain: string;
    lightclouds: string;
    lightrain: string;
    storm: string;
    sun: string;
    thunder: string;
    wind: string;
  }
  user!: {
    config: string;
    events_schedule: string;
    profiles: any;
    cache: any;
  }

  constructor() {
    // Init our database
    Object.assign(this, JsonManager.read("user/cache/db.json"));
  }

  load(newDatabase: any) {
    Object.assign(this, newDatabase);
  }

  save() {
    JsonManager.write("user/cache/db.json", this);
  }

}