import express from 'express';
import puppeteer from 'puppeteer-core'
import { PORT } from './get-browser'
import * as os from 'os'
import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdirp from 'mkdirp'

const STATIC_FILES = path.resolve(__dirname, '../../static')

export default async function() {
  const app = express();

  app.use('/', express.static(STATIC_FILES));
  app.use('/**', express.static(STATIC_FILES));

  let server!: http.Server
  await new Promise(res => server = app.listen(PORT, res))

  const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

  const browser = await puppeteer.launch({
    headless: false,
    // Change the executablePath for windows or linux
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  ;((global as any).__BROWSER_GLOBAL__ as puppeteer.Browser) = browser;
  ;((global as any).__SERVER_GLOBAL__ as http.Server) = server;

  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
}
