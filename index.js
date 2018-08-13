/*
https://ourcodeworld.com/articles/read/374/how-to-download-the-source-code-js-css-and-images-of-a-website-through-its-url-web-scraping-with-node-js
https://www.npmjs.com/package/website-scraper#sources
*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const scrape = require("website-scraper");
const args = require("minimist")(process.argv.slice(2));

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
    { selector: "link[rel='stylesheet']", attr: "href"}
  ]
};

// with promise
scrape(options).then((result) => {
  console.log("success!");
  console.log(dom.window.document.createElement("div"));
}).catch((err) => {
  console.log("error :(", err);
});

// or with callback
scrape(options, (error, result) => {
    /* some code here */
});
