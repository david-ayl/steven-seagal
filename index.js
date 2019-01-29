const jsdom         = require("jsdom");
const scrape        = require("website-scraper");
const args          = require("minimist")(process.argv.slice(2));
const puppeteer     = require("puppeteer");
const fs            = require("fs-extra");
const colors        = require("colors");
const nameGenerator = require('./modules/folder_name_generator.js');

/* TODO

https://www.nytimes.com/
-> Blank

https://www.urbanlife.de/
https://www.wallstreet-online.de/
-> no images


*/

console.log("a");

const { JSDOM }   = jsdom;
const dom = new JSDOM(``, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  userAgent: "Mellblomenator/9000",
  includeNodeLocations: true,
  storageQuota: 10000000
});

// Pupetter Chrome au lieu d'interaction avec Node
// https://github.com/GoogleChrome/puppeteer

var assets = {
  resources : {
    html: [],
    css: [],
    js: [],
    others: []
  },
  dest_folder: nameGenerator(),
};

class CustomPuppeteer {
  apply(registerAction) {
    let browser;
    registerAction("beforeStart", async () => {
      console.log("IN START");
      browser = await puppeteer.launch({headless: false});
    });
    registerAction("afterResponse", async({response}) => {
      const contentType = responseheaders["content-type"];
      const isHtml = contentType && contentType.split(";")[0] === "text/html";
      if(isHtml) {
        const url = response.request.href;
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await page.close();
        return content;
      }
      else {
        return response.body
      }
    });
    registerAction("afterFinish", () => browser.close());
  }
}

var options = {
  urls: [args.u],
  directory: `./websites/${assets.dest_folder}`,
  plugins: [new CustomPuppeteer()]
};

/*
var browser, page;

var options = {
  urls: [args.u],
  directory: "./websites/" + assets.dest_folder,
  sources: [
    { selector: "img", attr: "src" },
    { selector: "link[rel='stylesheet']", attr: "href"},
    { selector: "script", attr: "src"}
  ],
  beforeStart: (async () => {
    console.log("Preparing download...".green);
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.setViewport({width:1440, height:790});
    await page.goto(options.urls[0]);
    console.log("chromium is ready".green);
  })(),
  afterResponse: (async () => {
    console.log("AFTER RESPONSE");
  })(),
  onResourceSaved: (resource) => {
    switch(resource.type) {
      case "html":
        assets.resources.html.push(resource.url);
        break;
      case "js":
        assets.resources.js.push(resource.url);
        break;
      case "css":
        assets.resources.css.push(resource.url);
        break;
      default:
        assets.resources.others.push(resource.url);
        break;
    }
  },
  onResourceError: (resource) => {
    console.log(resource.url);
    console.log("failed".red);
  }
};
*/

// with promise
scrape(options).then((result) => {
  console.log(`${assets.resources.html.length} html, ${assets.resources.css.length} css, ${assets.resources.js.length} js and ${assets.resources.others.length} other(s) file(s) resources have been successfully saved.`.green);
  console.log(`Saved destination folder => ${assets.dest_folder}`.green);
}).catch((err) => {
  console.log("error :(", err);
});
