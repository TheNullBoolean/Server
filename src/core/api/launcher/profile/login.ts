import { CustomResponse, deflate } from "../../../WebServer";

export const profileLogin = (req: Request, res: CustomResponse) => {
  deflate(res, '1');
}