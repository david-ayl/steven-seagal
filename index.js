/*
https://ourcodeworld.com/articles/read/374/how-to-download-the-source-code-js-css-and-images-of-a-website-through-its-url-web-scraping-with-node-js
https://www.npmjs.com/package/website-scraper#sources
*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const scrape = require('website-scraper');

const dom = new JSDOM(``, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  userAgent: "Mellblomenator/9000",
  includeNodeLocations: true,
  storageQuota: 10000000
});


var options = {
  urls: ['https://www.marieclaire.fr/ou-etait-harvey-weinstein-pendant-sept-mois,1266358.asp'],
  directory: './websites/',
  sources: [
    { selector: 'img', attr: 'src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href'}
  ]
};

// with promise
scrape(options).then((result) => {
  console.log('success!');
  console.log(dom.window.document.createElement("div"));
}).catch((err) => {
  console.log("error :(", err);
});

// or with callback
scrape(options, (error, result) => {
    /* some code here */
});
