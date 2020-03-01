import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";

export const keepalive = (req: Request, res: CustomResponse) => {
  deflate(res, {
    ...res.nullResponse,
    data: {
      msg: 'OK',
    },
  });
}