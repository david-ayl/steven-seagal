const jsdom = require('jsdom')
const { JSDOM } = jsdom
const fs = require('fs')
const path = require('path')


exports.modifier = function(htmlFile) {

  let currentPath = path.resolve(__dirname, `../websites/${htmlFile}/index.html`)

  fs.readFile(currentPath, 'utf8', (err, data) => {
    if(err) { throw err }
    else {

      let dom = new JSDOM(data).window.document

      for(let i = 0; i < dom.querySelectorAll('script').length; i++) {
        dom.querySelectorAll('script')[i].innerHTML = ''
        dom.querySelectorAll('script')[i].setAttribute('src', 'void(0)')
      }

      for(let i = 0; i < dom.querySelectorAll('iframe').length; i++) {
        dom.querySelectorAll('iframe')[i].remove()
      }

      dom = dom.documentElement.outerHTML

      fs.writeFile(currentPath, dom, 'utf8', (err) => {
        if(err) { throw err}
        else { console.log('index.html has been successfully cleaned') }
      })
    }
  })

}
