const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhonex = devices['iPhone X']
const {hasValues, autoScroll} = require('../functions')
const ora = require('ora')
const chalk = require('chalk')




module.exports = (_directory, _isMobile) => {
  directory = _directory
  isMobile = _isMobile
  return PuppeteerPlugin
}

class PuppeteerPlugin {
  constructor({
    launchOptions = {},
		scrollToBottom = null
  } = {}) {
    this.launchOptions = launchOptions
    this.scrollToBottom = scrollToBottom
    this.browser = null
    this.headers = {}
    this.assetList = {
      'html': [],
      'css': [],
      'various': []
    }
  }

  apply(registerAction) {

    let absoluteDirectoryPath, loadedResources = []


    registerAction('beforeStart', async () => {
      var spinner = ora('Launching the browser')
      spinner.color = 'yellow'
      spinner.start()
      this.browser = await puppeteer.launch(this.launchOptions);
      spinner.succeed('browser launched')

    absoluteDirectoryPath = path.resolve(process.cwd(), directory)

    if (fs.existsSync(absoluteDirectoryPath)) {
    	throw new Error(`Directory ${absoluteDirectoryPath} exists`)
    }

    });

    registerAction('beforeRequest', async ({ requestOptions }) => {
      if (hasValues(requestOptions.headers)) {
        this.headers = Object.assign({}, requestOptions.headers)
      }
      return { requestOptions }
    });

    registerAction('saveResource', async ({resource}) => {
      const filename = path.join(absoluteDirectoryPath, resource.getFilename())
      const text = resource.getText()
      await fs.outputFile(filename, text, { encoding: resource.type === 'html' ? 'utf8' : 'binary' })
      loadedResources.push(resource)
    })

    registerAction('onResourceSaved', ({resource}) => {
      this.assetList[resource.getType() == undefined ? 'various' : resource.getType()].push(resource.getFilename())
    })

    registerAction('afterResponse', async ({ response }) => {
      const contentType = response.headers['content-type']
      const isHtml = contentType && contentType.split(';')[0] === 'text/html'

      if (isHtml) {
        const url = response.request.href
        const page = await this.browser.newPage()

        if(isMobile) {
          await page.emulate(iPhonex)
        }

        if (hasValues(this.headers)) {
          await page.setExtraHTTPHeaders(this.headers)
        }

        await page.goto(url)

        console.log(this.scrollToBottom.timeout, this.scrollToBottom.viewportN)

        if(this.scrollToBottom) {
          var spinner = ora('Scrolling down, please wait')
          spinner.color = 'yellow'
          spinner.start()
					await autoScroll(page, this.scrollToBottom.timeout, this.scrollToBottom.viewportN)
          spinner.succeed('Finished scrolling')
				}

        let content = await page.content()
        content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '')

        await page.close()
        return content
      } else {
        return response.body
      }

    });

    registerAction('afterFinish', () => this.browser && this.browser.close())

  }

  get summary() {
    return this.assetList
  }
}
