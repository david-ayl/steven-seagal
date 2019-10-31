
exports.hasValues = function(obj) {
  return obj && Object.keys(obj).length > 0
}

exports.autoScroll = async function(page, timeout, viewportN) {
  await page.evaluate(async (timeout, viewportN) => {
		await new Promise((resolve, reject) => {
			let totalHeight = 0, distance = 200, duration = 0, maxHeight = window.innerHeight * viewportN;
			const timer = setInterval(() => {
				duration += 200;
				window.scrollBy(0, distance);
				totalHeight += distance;
				if (totalHeight >= document.body.scrollHeight || duration >= timeout || totalHeight >= maxHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 200);
		});
	}, timeout, viewportN);
}
