import puppeteer from 'puppeteer-core'
import * as http from 'http'
import * as os from 'os'
import * as path from 'path'
import * as rimraf from 'rimraf'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export default async function () {
  const browser = ((global as any).__BROWSER_GLOBAL__ as puppeteer.Browser);
  const server = ((global as any).__SERVER_GLOBAL__ as http.Server);
  
  await browser.close();
  await new Promise(res => server.close(res))

  rimraf.sync(DIR);
};