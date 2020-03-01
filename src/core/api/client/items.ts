import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Database } from "../../Database";
import { JsonManager } from "../../util/JsonManager";

export const getItems = (req: Request, res: CustomResponse) => {
  const db = container.resolve(Database);

  deflate(res, res.response(JsonManager.read(db.user.cache.items)));
}