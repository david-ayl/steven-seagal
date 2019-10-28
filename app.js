const scrape = require('website-scraper')
const argv = require('minimist')(process.argv.slice(2))
const URL = require('url').URL;

const directory = './website/'
const dest = directory + new URL(argv._[0]).hostname + '/' + Date.now() + '/'

let isMobile = argv.m

let isHeadless = (() => {
  return argv.h ? false : true
})()

const PuppeteerPlugin = require('./assets/classes/puppeteerplugin-class')(dest, isMobile)

const full_scraping = {
   urls: argv._[0],
   sources: [
      { selector: 'img', attr: 'src' },
      { selector: 'link[rel="stylesheet"]', attr: 'href' },
   ],
   plugins: [new PuppeteerPlugin({ launchOptions: {
      headless: isHeadless,
      defaultViewport: null,
      width: 1280,
      height: 920,
   }})]
}

const simple_scraping = {
   urls: argv._[0],
   sources: [],
   directory: './websites/' + dest//getLocalPath(argv._[0])
}

/*
function getLocalPath(path) {
   return path.match(/(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])\/[0-9]+\/index\.html$/)[0]
}
*/

scrape(full_scraping).then((result) => console.log('the page has been saved'))
//scrape(simple_scraping).then((result) => console.log('the page has been saved'))
