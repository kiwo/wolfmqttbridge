const puppeteer = require('puppeteer')

const express = require('express')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
const port = 3000

app.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const browser = await puppeteer.launch({
    bindAddress: "0.0.0.0",
    args: [
      "--no-sandbox",
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ]
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://www.wolf-smartset.com/');
    await page.type('input[name="Input.Username"]', username, { delay: 20 })
    await page.type('input[name="Input.Password"]', password, { delay: 20 })
    await page.keyboard.press('Enter')

    await page.waitForTimeout(5000);
    const sessionStorage = await page.evaluate(() => Object.assign({}, window.sessionStorage))
    const something = JSON.parse(sessionStorage["oidc.user:https://www.wolf-smartset.com/idsrv:smartset.web"])
    console.log(something)
    res.send(something)
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
})

app.listen(port, () => {
  console.log(`Authcode-resolver app listening at http://localhost:${port}`)
})

