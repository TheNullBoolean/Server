// "/client/languages", getLocale

import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Database } from "../../Database";
import { JsonManager } from "../../util/JsonManager";

export const getLanguages = (req: Request, res: CustomResponse) => {
  const db = container.resolve(Database);
  
  deflate(res, JsonManager.read(db.user.cache.languages));
}