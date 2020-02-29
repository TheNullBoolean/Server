import * as express from 'express';
import * as cors from 'cors';
import * as https from 'https';
import * as zlib from 'zlib';
import { generateCertifcate } from './util/generateCertificate';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { Logger } from './util/Logger';
import * as cookieParser from 'cookie-parser';
import { launcherRoutes } from './api/launcher';
import { clientRoutes } from './api/client';
import { Database } from './Database';
import { missingCacheRoutes } from './callback/missing';
import { Settings } from './Settings';

export interface CustomResponse extends Response {
  sessionId?: string | number;
  nullResponse?: any;
}

export class WebServer {
  app: any;
  logger: Logger;
  db: Database;
  settings: Settings;

  constructor() {
    // Grab our singleton instance of logger
    this.logger = container.resolve(Logger);
    this.db = container.resolve(Database);
    this.settings = container.resolve(Settings);
    
    // TODO: this sorta replaces startCallbacks
    // but I don't think this will work very well
    // need to come up with a better implementation
    // - can we not store these in the Cache class directly?
    missingCacheRoutes();

    // Create our REST API Container
    this.app = express();

    this.initExpress();

    https.createServer(generateCertifcate(this.settings.server.ip), this.app)
    .listen(this.settings.server.httpsPort, this.settings.server.ip, () => {
      this.settings.server.backendUrl = `https://${this.settings.server.ip}:${this.settings.server.httpsPort}`;
      this.logger.logSuccess("Started server");
    });
  }
  
  initExpress() {
    this.app.use(cors());
    this.app.use(cookieParser());
    
    // Zlib Inflation
    this.app.use((req: Request, res: CustomResponse, next: NextFunction) => {
      const sessionId = req.cookies.PHPSESSID || -1;
      res.cookie('PHPSESSID', sessionId);

      // Create a null response object to easily forward back if we need to
      res.nullResponse = {
        err: 0,
        errmsg: null,
        data: null,
      }

      this.logger.logRequest(`[${req.method}][${sessionId}][${req.connection.remoteAddress}] ${req.url}`);

      if (req.method === "POST") {
        req.on('data', (data: Buffer) => {
          zlib.inflate(data, (err, body) => {
            if (body) {
              try {
                req.body = JSON.parse(body.toString());
                return next();
              } catch {
                req.body = body.toString();

                return next();
              }
            }

            req.body = {};
            return next();
          });
        });

        return;
      }

      next();
    });

    // Routes

    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send('API Online');
    });

    // Launcher Routes
    launcherRoutes(this.app);
    clientRoutes(this.app);
  }
}

export function deflate(res: CustomResponse, data: any) {
  res.setHeader('content-encoding', 'deflate');
  res.setHeader('content-type', 'application/json');

  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }

  zlib.deflate(data, (err, buf) => {
    res.send(buf);
  });
}