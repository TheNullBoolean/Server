import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Location } from "../../game/Location";

export const getLocations = (req: Request, res: CustomResponse) => {
  const locations = container.resolve(Location);

  deflate(res, res.response(locations.generateAll()));
}