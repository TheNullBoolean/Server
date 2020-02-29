import { profileLogin } from "./profile/login";

export const launcherRoutes = (app: any) => {
  app.post("/launcher/profile/login", profileLogin);
}