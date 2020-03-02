import { getLocale } from "./menu/getLocale";
import { validateVersion } from "./game/validateVersion";
import { getLanguages } from "./languages";
import { keepalive } from "./game/keepalive";
import { getItems } from "./items";
import { getGlobals } from "./globals";
import { getLocations } from "./locations";
import { getProfileList, selectProfile } from "./game/profile";
import { getWeather } from "./weather";
import { getClientLocale } from "./locale/clientLocale";
import { getProfileStatus } from "./profile";
import { getTemplates } from "./handbook/templates";
import { getQuestList } from "./quest/list";
import { createChannel } from "./notifier/createChannel";

export const clientRoutes = (app: any) => {
  // client
  app.post('/client/languages', getLanguages);
  app.post('/client/items', getItems);
  app.post('/client/globals', getGlobals);
  app.post('/client/locations', getLocations);
  app.post('/client/weather', getWeather);

  // client/profile
  app.post('/client/profile/status', getProfileStatus);

  // client/locale
  app.post("/client/locale/:language", getClientLocale);

  // client/menu
  app.post("/client/menu/locale/:language", getLocale);

  // client/handbook
  app.post("/client/handbook/templates", getTemplates);

  // client/notifier
  app.post("/client/notifier/channel/create", createChannel);

  // client/quest
  app.post("/client/quest/list", getQuestList);

  // client/game
  app.post("/client/game/version/validate", validateVersion);
  app.post("/client/game/keepalive", keepalive);
  app.post("/client/game/profile/list", getProfileList);
  app.post("/client/game/profile/select", selectProfile);
}