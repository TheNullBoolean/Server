import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { JsonManager } from "../../../util/JsonManager";
import { Database } from "../../../Database";

export const getLocale = (req: Request, res: CustomResponse) => {
  const { language = 'en' } = req.params;
  const db = container.resolve(Database);
  
  deflate(res, JsonManager.read(db.locales[language.toLowerCase()].menu));
}