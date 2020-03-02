import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Server } from "../../../Server";

export const getProfileList = (req: Request, res: CustomResponse) => {
  const server = container.resolve(Server);

  // Get our account
  const account = server.accounts[res.sessionId];
  const data = [];

  if (!account.wipe) {
    data.push(server.profiles[res.sessionId].pmc);
    data.push(server.profiles[res.sessionId].scav);
  }

  deflate(res, res.response(data));
}