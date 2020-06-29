import puppeteer from 'puppeteer-core'
import { Observable } from 'rxjs'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

export const PORT = '4220'
export const getUrl = () => `http://localhost:${PORT}`

export const getBrowser = async (): Promise<puppeteer.Browser> => {
  const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');

  if (!wsEndpoint) {
    throw new Error('wsEndpoint not found');
  }

  return puppeteer.connect({
    browserWSEndpoint: wsEndpoint,
  });
}

export const listenToConsole = async (page: puppeteer.Page | Promise<puppeteer.Page>) => {
  (await page).on('console', e => {
    try {
      console.log(JSON.parse(e.text()))
    } catch (error) {
      console.log(e.text())
    }
  })
} 

export const newPage = async (url?: string) => {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.goto(url || getUrl())
  return page
}