import { singleton } from "tsyringe";
import { JsonManager } from "./util/JsonManager";

@singleton()
export class Resources {

  banners!: {
    [key: string]: string;
  }
  
	handbook!: {
    [key: string]: string;
  }
  
	hideout!: {
    [key: string]: string;
  }
    
  quest!: {
    [key: string]: string;
  }
  
	trader!: {
    [key: string]: string;
	}

  constructor() {
    // Init our database
    Object.assign(this, JsonManager.read("user/cache/res.json"));
  }

  load(newResources: any) {
    Object.assign(this, newResources);
  }

  save() {
    JsonManager.write("user/cache/res.json", this);
  }

}