import * as puppeteer from 'puppeteer'
import { newPage } from '../setup'

describe('Index Page', () => {
  let page: puppeteer.Page

  beforeAll(async () => {
    page = await newPage()
  });

  afterAll(async () => {
    await page.close()
  })

  it('Should be titled "Document"', async () => {
    await expect(page.title()).resolves.toMatch('Document');
  });

  it('Should submit form', async () => {
    await page.setRequestInterception(true);

    const onFormHttpCall = new Promise<any>(res => 
      page.on('request', async req => {
        if (req.method() === 'POST' && req.url().includes('/api/forms')) {
          const form = JSON.parse(req.postData()!)
          res(form)
          req.respond({})
          return
        }
        req.continue()
      }
    ))
  
    // Fill out the form and click submit
    await page.type('#email', 'testman@fakeemail.com')
    await page.click('#submit')
  
    // Wait for the listener to resolve
    const results = await onFormHttpCall
  
    // Test to see if the api call contains the right data
    expect(results).toEqual({
      email: 'testman@fakeemail.com'
    })
  })
});