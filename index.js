const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const j2cp = require('json2csv').Parser;
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://www.amazon.com/s?i=fashion-womens-intl-ship&bbn=16225018011&rh=n%3A16225018011%2Cn%3A1040660%2Cn%3A1045024&pd_rd_r=25cc6725-31d0-4cd4-9c37-bb028a898111&pd_rd_w=5W3dX&pd_rd_wg=l3EAE&pf_rd_p=6a92dcea-e071-4bb9-866a-369bc067390d&pf_rd_r=055EV752YC6GB7RGJ6GW&rnid=1040660&ref=pd_gw_unk");

  const productsData = []

  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  });

  const $ = cheerio.load(pageData.html);

  const products = $('.a-spacing-base')

  products.each(function () {
    title = $(this).find("div .s-title-instructions-style .a-size-mini a span").text()
    price = $(this).find("div .s-price-instructions-style div a .a-price .a-offscreen").text()

    productsData.push({ title, price })
  })

  const parser = new j2cp()
  const csv = parser.parse(productsData)
  fs.writeFileSync("./results/products.csv", csv)

  await browser.close();
})();