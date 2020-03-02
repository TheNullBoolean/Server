import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { JsonManager } from "../../../util/JsonManager";
import { Database } from "../../../Database";

export const getClientLocale = (req: Request, res: CustomResponse) => {
  const { language = 'en' } = req.params;
  const database = container.resolve(Database);

  deflate(res, res.response(JsonManager.read(database.user.cache[`locale_${language.toLowerCase()}`])));
}