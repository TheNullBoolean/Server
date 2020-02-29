import { getLocale } from "./menu/getLocale";
import { validateVersion } from "./game/validateVersion";
import { getLanguages } from "./languages";

export const clientRoutes = (app: any) => {
  // client
  app.post('/client/languages', getLanguages);

  // client/menu
  app.post("/client/menu/locale/:language", getLocale);

  // client/game
  app.post("/client/game/version/validate", validateVersion);
}