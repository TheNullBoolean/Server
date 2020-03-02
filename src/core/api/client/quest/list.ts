import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from "tsyringe";
import { Database } from "../../../Database";
import { JsonManager } from "../../../util/JsonManager";

export const getQuestList = (req: Request, res: CustomResponse) => {
  const database = container.resolve(Database);

  deflate(res, res.response(JsonManager.read(database.user.cache.quests)));
}