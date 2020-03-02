import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from "tsyringe";
import { Settings } from "../../../Settings";

export const createChannel = (req: Request, res: CustomResponse) => {
  const settings = container.resolve(Settings);

  const data = {
    notifier: {
      server: `${settings.server.backendUrl}/`,
      channel_id: 'testChannel',
      url: `${settings.server.backendUrl}/notifierServer/get/${res.sessionId}`,
    },
    notifierServer: `${settings.server.backendUrl}/notifierServer/get/${res.sessionId}`,
  };

  deflate(res, res.response(data));
}