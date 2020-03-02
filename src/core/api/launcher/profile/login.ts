import { CustomResponse, deflate } from "../../../WebServer";
import { container } from "tsyringe";
import { Server } from "../../../Server";
import { Request } from "express";

export const profileLogin = (req: Request, res: CustomResponse) => {
  const server = container.resolve(Server);
  const { token } = req.body;

  deflate(res, server.login(token));
}