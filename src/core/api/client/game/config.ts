import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Settings } from "../../../Settings";

export const validateVersion = (req: Request, res: CustomResponse) => {
  const settings = container.resolve(Settings);

  const config = {
    err: 0,
    errmsg: null,
    data: {
      queued: false,
      banTime: 0,
      hash: 'BAN0',
      lang: 'en',
      aid: res.sessionId,
      token: `token_${res.sessionId}`,
      taxonomy: 341,
      activeProfileId: `user${res.sessionId}pmc`,
      nickname: 'user', 
      backend: {
        Trading: settings.server.backendUrl,
        Messaging: settings.server.backendUrl,
        Main: settings.server.backendUrl,
        RagFair: settings.server.backendUrl,
      },
      totalInGame: 0
    }
  };
  
  deflate(res, config);
}
