import { getLocale } from "./menu/getLocale";

export const clientRoutes = (app: any) => {
  app.post("/client/menu/locale/:language", getLocale);
}