import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";

export const getProfileStatus = (req: Request, res: CustomResponse) => {
  const data = [
    {
      profileid: `scav${res.sessionId}`,
      status: 'Free',
      sid: '',
      ip: '',
      port: 0
    },
    {
      profileid: `pmc${res.sessionId}`,
      status: 'Free',
      sid: '',
      ip: '',
      port: 0
    }
  ];

  deflate(res, res.response(data));
}