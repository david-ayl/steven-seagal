
exports.hasValues = function(obj) {
   return obj && Object.keys(obj).length > 0
}

exports.autoScroll = async function(page) {
   await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
         var totalHeight = 0;
         var distance = 200;
         var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
            }
         }, 200);
      });
   });
}
