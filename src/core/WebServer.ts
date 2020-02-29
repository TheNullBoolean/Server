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

export interface CustomResponse extends Response {
  sessionId?: string | number;
}

export class WebServer {

  app: any;
  logger: Logger;

  constructor(ip: string, port: number) {
    // Grab our singleton instance of logger
    this.logger = container.resolve(Logger);

    // Create our REST API Container
    this.app = express();

    this.initExpress();

    https.createServer(generateCertifcate(ip), this.app)
    .listen(port, ip, () => {
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

      this.logger.logRequest(`[${sessionId}][${req.connection.remoteAddress}] ${req.url}`);

      if (req.method === "POST") {
        req.on('data', (data: Buffer) => {
          zlib.inflate(data, (err, body) => {
            body ? req.body = JSON.parse(body.toString()) : req.body = {};
            next();
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
  }
}

export function deflate(res: CustomResponse, data: string) {
  res.setHeader('content-encoding', 'deflate');
  res.setHeader('content-type', 'application/json');

  zlib.deflate(data, function (err, buf) {
    res.status(200).send(buf);
  });
}