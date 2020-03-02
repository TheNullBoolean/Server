import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Server } from "../../../Server";
import { Settings } from "../../../Settings";

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

export const selectProfile = (req: Request, res: CustomResponse) => {
  const settings = container.resolve(Settings);

  const data = {
    status:"ok",
    notifier: {
      server: `${settings.server.backendUrl}/`,
      channel_id: "testChannel"
    }
  };

  deflate(res, res.response(data));
}