const scrape        = require('website-scraper')
const nameGenerator = require('./modules/folder_name_generator')
const args          = require('minimist')(process.argv.slice(2))
const puppeteer     = require('puppeteer')
const html					= require('./modules/html')
const fs						= require('fs')


var assets = {
  dest_folder: nameGenerator(),
}


class PuppeteerPlugin {
	apply(registerAction) {
		let browser

		registerAction('beforeStart', async () => {

			browser = await puppeteer.launch({headless: true})


		})

		registerAction('afterResponse', async ({response}) => {

			const url = response.request.href
			const page = await browser.newPage()
			await page.goto(url)
			await page.evaluate(_ => {
				window.scrollBy(0, window.innerHeight);
			})
			const content = await page.content()

			if (response.headers['content-type'].indexOf('text/html') !== -1) {

				return {
					body: response.body,
					metadata: {
						headers: response.headers
					}
				}

			} else {

				return {
					body: response.body,
					metadata: {
						headers: response.headers
					}
				}

			}
		})
		registerAction('afterFinish', () => browser.close())
	}
}


var options = {
  urls: [args.u],
  directory: `./websites/${assets.dest_folder}`,
	subdirectories: [
		{directory: 'svg', extensions: ['.svg']},
		{directory: 'img', extensions: ['.jpg', '.png', 'gif', 'jpeg', '']},
		{directory: 'css', extensions: ['.css']},
		{directory: 'fonts', extensions: ['.woff', '.woff2', '.ttf']}
	],
	sources: [
		{selector: 'img', attr: 'src'},
		{selector: 'link[rel="stylesheet"]', attr: 'href'}
	],
  plugins: [ new PuppeteerPlugin() ]
}

scrape(options).then((result) => {

	console.log(`saved in => ${assets.dest_folder}`);
	html.modifier(assets.dest_folder)

}).catch((err) => {
  console.log('error :(', err)
})
