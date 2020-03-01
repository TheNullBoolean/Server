import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Database } from "../../Database";
import { JsonManager } from "../../util/JsonManager";

export const getGlobals = (req: Request, res: CustomResponse) => {
  const db = container.resolve(Database);

  const globals = JsonManager.read(db.globals);

  deflate(res, res.response({
    ...globals,
    data: {
      ...globals.data,
      time: Date.now() / 1000,
    }
  }));
}