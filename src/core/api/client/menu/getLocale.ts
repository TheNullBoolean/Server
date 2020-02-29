import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { JsonManager } from "../../../util/JsonManager";

export const getLocale = (req: Request, res: CustomResponse) => {
  const { language = 'en' } = req.params;

  // const localeData = JsonManager.read(db.)
  
  deflate(res, '1');
}