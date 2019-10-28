const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhonex = devices['iPhone X']
const {hasValues, autoScroll} = require('../functions')


module.exports = (_directory, _isMobile) => {
   directory = _directory
   isMobile = _isMobile
   return PuppeteerPlugin
}

let PuppeteerPlugin = class {
   constructor({ launchOptions = {} } = {}) {
      this.launchOptions = launchOptions;
      this.browser = null;
      this.headers = {};
    }

    apply(registerAction) {

      let absoluteDirectoryPath, loadedResources = [];

      registerAction('beforeStart', async () => {
         this.browser = await puppeteer.launch(this.launchOptions);

			absoluteDirectoryPath = path.resolve(process.cwd(), directory);

			if (fs.existsSync(absoluteDirectoryPath)) {
				throw new Error(`Directory ${absoluteDirectoryPath} exists`);
			}

      });

      registerAction('beforeRequest', async ({ requestOptions }) => {
         if (hasValues(requestOptions.headers)) {
            this.headers = Object.assign({}, requestOptions.headers);
         }
         return { requestOptions };
      });

      registerAction('saveResource', async ({resource}) => {
         const filename = path.join(absoluteDirectoryPath, resource.getFilename());
			const text = resource.getText();
         var encoding = 'binary'
         if (resource.type === 'html') {
         	encoding  = 'utf8';
         }

			await fs.outputFile(filename, text, { encoding: encoding });
			loadedResources.push(resource);
      })

      registerAction('afterResponse', async ({ response }) => {
         const contentType = response.headers['content-type'];
         const isHtml = contentType && contentType.split(';')[0] === 'text/html';

         if (isHtml) {
            const url = response.request.href;
            const page = await this.browser.newPage();

            if(isMobile) {
               await page.emulate(iPhonex);
            }

            if (hasValues(this.headers)) {
               await page.setExtraHTTPHeaders(this.headers);
            }

            await page.goto(url)

            await autoScroll(page)

            let content = await page.content()
            content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '')

            await page.close()
            return content
         } else {
            return response.body
         }

      });

      registerAction('afterFinish', () => this.browser && this.browser.close());
   }
}
