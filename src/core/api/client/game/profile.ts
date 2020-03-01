import { CustomResponse, deflate } from "../../../WebServer";
import { Request } from "express";
import { container } from 'tsyringe';
import { Database } from "../../../Database";
import { JsonManager } from "../../../util/JsonManager";
import { Accounts } from "../../../Accounts";

export const getProfileList = (req: Request, res: CustomResponse) => {
  const account = container.resolve(Accounts);

  // deflate(res, res.response(JsonManager.read(db.user.cache.items)));

  // if (account.isWiped(sessionID)) {
  //   output.data.push(profile_f.profileServer.getPmcProfile(sessionID));
  //   output.data.push(profile_f.profileServer.getScavProfile(sessionID));
  // }

  // return json.stringify(output);

  // TODO
}