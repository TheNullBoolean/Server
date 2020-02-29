import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";

export const validateVersion = (req: Request, res: CustomResponse) => {
  deflate(res, res.nullResponse);
}