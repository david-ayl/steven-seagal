const scrape        = require("website-scraper");
const args          = require("minimist")(process.argv.slice(2));
const fs            = require("fs-extra");
const colors        = require("colors");
const nameGenerator = require('./modules/folder_name_generator.js');
const puppeteer     = require('puppeteer');


var assets = {
  dest_folder: nameGenerator(),
};

var browser;

var options = {
  urls: [args.u],
  directory: `./websites/${assets.dest_folder}`,
  plugins: [{
      beforeStart: async () => {
        browser = await puppeteer.launch({headless: true});
      },
      afterResponse: async (response) => {
        console.log(response);
        const contentType = response.headers['content-type'];
  			const isHtml = contentType && contentType.split(';')[0] === 'text/html';
  			if (isHtml) {
  				const url = response.request.href;
  				const page = await browser.newPage();
  				await page.goto(url);
  				const content = await page.content();
  				await page.close();
  				return content;
  			} else {
  				return response.body;
  			}
      },
      afterFinish: async () => {
        browser.close()
      }
    }]
};

scrape(options).then((result) => {
  console.log(`Saved destination folder => ${assets.dest_folder}`.green);
}).catch((err) => {
  console.log("error :(", err);
});
