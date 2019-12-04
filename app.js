const scrape = require('website-scraper')
const argv = require('minimist')(process.argv.slice(2))
const URL = require('url').URL
const chalk = require('chalk')

const directory = './website/'
const dest = directory + new URL(argv._[0]).hostname + '/' + Date.now() + '/'

let isMobile = argv.m

let isHeadless = (() => argv.h ? false : true)()

let scrollTimeout = argv.s || 15000

let scrollViewportN = argv.v

const PuppeteerPlugin = require('./assets/classes/puppeteerplugin-class')(dest, isMobile)


var full = new PuppeteerPlugin({
    launchOptions: {
      headless: isHeadless,
      defaultViewport: null,
      width: 1280,
      height: 920
    },
    scrollToBottom: {
      timeout: scrollTimeout,
      viewportN: scrollViewportN
    }})



const full_scraping = {
   urls: argv._[0],
   sources: [
      { selector: 'img', attr: 'src' },
      { selector: 'link[rel="stylesheet"]', attr: 'href' },
   ],
   plugins: [full]
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

scrape(full_scraping).then((result) => {
  console.log(chalk.green(`${full.summary.html.length} HTML file(s),`), chalk.yellow(`${full.summary.css.length} CSS file(s),`), 'and', chalk.cyan(`${full.summary.various.length} various asset(s)`), 'have been successfully Seagalized')
})

//scrape(simple_scraping).then((result) => console.log('the page has been saved'))
