const scrape        = require('website-scraper');
const nameGenerator = require('./modules/folder_name_generator.js');
const args          = require('minimist')(process.argv.slice(2));
const puppeteer     = require('puppeteer');



class PuppeteerPlugin {
	apply(registerAction) {
		let browser;
		registerAction('beforeStart', async () => {
			browser = await puppeteer.launch({headless: true});
		});
    registerAction('onResourceSaved', ({resource}) => {
      //console.log(resource.url);
    });
		registerAction('afterResponse', async ({response}) => {
			const contentType = response.headers['content-type'];
			const isHtml = contentType && contentType.split(';')[0] === 'text/html';
			if (isHtml) {
				const url = response.request.href;
				const page = await browser.newPage();
				await page.goto(url);
				const content = await page.content();
				await page.close();
				//console.log(content)
				return content;
			} else {
				return response.body;
			}
		});
		registerAction('afterFinish', () => browser.close());
	}
}
var assets = {
  dest_folder: nameGenerator(),
};

var options = {
  urls: [args.u],
  directory: `./websites/${assets.dest_folder}`,
	subdirectories: [
		{directory: 'svg', extensions: ['.svg']},
		{directory: 'img', extensions: ['.jpg', '.png', 'gif', 'jpeg', '']},
		{directory: 'css', extensions: ['.css']},
		{directory: 'fonts', extensions: ['.woff', '.woff2']}
	],
	sources: [
		{selector: 'img', attr: 'src'},
		{selector: 'link[rel="stylesheet"]', attr: 'href'}
	],
  plugins: [ new PuppeteerPlugin() ]
};

scrape(options).then((result) => {
  console.log(`Saved destination folder => ${assets.dest_folder}`);
}).catch((err) => {
  console.log('error :(', err);
});
