import { CustomResponse, deflate } from "../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Weather } from "../../game/Weather";

export const getWeather = (req: Request, res: CustomResponse) => {
  const weather = container.resolve(Weather);

  deflate(res, res.response(weather.generate()));
}