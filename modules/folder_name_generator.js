'use strict';

var folder_name_generator = function(){
	var 	dateObj 	= new Date(),
				seconds 	= dateObj.getSeconds(),
				minutes 	= dateObj.getMinutes(),
				hour 			= dateObj.getHours(),
				month 		= dateObj.getUTCMonth(),
				day 			= dateObj.getUTCDate(),
				year 			= dateObj.getUTCFullYear();

	var dummyNames = {
		adjs : ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",	"patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",	"polished", "ancient", "purple", "lively", "nameless", "yellow"],
		nouns : ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"]
	};

	var rnd = Math.floor(Math.random()*Math.pow(2,12));

	return "" + year + month + day + hour + minutes + seconds + "-" + dummyNames.adjs[rnd % dummyNames.adjs.length] + "-" + dummyNames.nouns[rnd % dummyNames.nouns.length];
};

module.exports = folder_name_generator;
