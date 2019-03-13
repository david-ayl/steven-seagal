const scrape        = require("website-scraper");
const nameGenerator = require("./modules/folder_name_generator.js");
const args          = require("minimist")(process.argv.slice(2));
const PuppeteerPlugin = require('website-scraper-puppeteer');


var assets = {
  dest_folder: nameGenerator(),
};

var options = {
  urls: [args.u],
  directory: `./websites/${assets.dest_folder}`,
  plugins: [ new PuppeteerPlugin() ]
};

scrape(options).then((result) => {
  console.log(`Saved destination folder => ${assets.dest_folder}`);
}).catch((err) => {
  console.log("error :(", err);
});
