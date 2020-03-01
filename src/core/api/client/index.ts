import { getLocale } from "./menu/getLocale";
import { validateVersion } from "./game/validateVersion";
import { getLanguages } from "./languages";
import { keepalive } from "./game/keepalive";
import { getItems } from "./items";
import { getGlobals } from "./globals";
import { getLocations } from "./locations";

export const clientRoutes = (app: any) => {
  // client
  app.post('/client/languages', getLanguages);
  app.post('/client/items', getItems);
  app.post('/client/globals', getGlobals);
  app.post('/client/locations', getLocations);

  // client/menu
  app.post("/client/menu/locale/:language", getLocale);

  // client/game
  app.post("/client/game/version/validate", validateVersion);
  app.post("/client/game/keepalive", keepalive);
}