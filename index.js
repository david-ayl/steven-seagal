const jsdom       = require("jsdom");
const scrape      = require("website-scraper");
const args        = require("minimist")(process.argv.slice(2));
const fs          = require("fs-extra");
const colors      = require("colors");

const { JSDOM }   = jsdom;
const dom = new JSDOM(``, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  userAgent: "Mellblomenator/9000",
  includeNodeLocations: true,
  storageQuota: 10000000
});


var options = {
  urls: [args.u],
  directory: "./websites/" + args.d,
  sources: [
    { selector: "img", attr: "src" },
    { selector: "link[rel='stylesheet']", attr: "href"},
    { selector: "script", attr: "src"}
  ],
  onResourceSaved: (resource) => {
    console.log(resource.url);
    console.log("successfully downloaded".green);
  },
  onResourceError: (resource) => {
    console.log(resource.url);
    console.log("failed".red);
  },
};

// with promise
scrape(options).then((result) => {

}).catch((err) => {
  console.log("error :(", err);
});
