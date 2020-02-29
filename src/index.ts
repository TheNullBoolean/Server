import "reflect-metadata";
import { WebServer } from "./core/WebServer";
import { container } from 'tsyringe';
import { Settings } from "./core/Settings";
import { Cache } from './core/Cache';

process.stdout.setEncoding('utf8');
process.title = "EmuTarkov Server";

const settings = container.resolve(Settings);

const cachce = new Cache();

// TODO: Replace all these globals...
// /* setup core files */
// global.db = {};
// global.res = {};

// /* setup routes and cache */
// const route = require('./server/route.js');
// route.all();

// /* core logic */
// global.router = (require('./server/router.js').router);
// global.events = require('./server/events.js');
// global.server = (require('./server/server.js').server);
// global.watermark = require('./server/watermark.js');

const server = new WebServer('127.0.0.1', 443);