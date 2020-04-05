const Promise = require('bluebird');
var shell = require('shelljs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

module.exports.encode = function(filePaths, processingInfo, destinationPath) {
	return new Promise(function(resolve, reject) {
		return executeCombiningWithPath(filePaths, processingInfo, destinationPath)
		.then(function() {
			return resolve();
		})
		.catch(function(err) {
			return reject(err);
		})
	});
}

function executeCombiningWithPath(filePaths, processingInfo, destinationPath) {
	return new Promise(function(resolve, reject) {
		return shell.exec(ffmpegPath + createCommandWithPath(filePaths, processingInfo, destinationPath), function(code, stdout, stderr) {
			if (code != 0) {
				return reject(stderr);
			}

			// Resolve now that the clips have been combined
			return resolve();
		});
	});
}

function createCommandWithPath(filePaths, processingInfo, destinationPath) {
	var str = " ";

	for (var i = 0; i < filePaths.length; i++) {
		str += "-r " + processingInfo.max_fps + " -i " + filePaths[i] + " ";
	}

	str += "-filter_complex \""
	for (var i = 0; i < filePaths.length; i++) {
		str += "[" + i + ":v]scale=" + processingInfo.max_width + "x" + processingInfo.max_height + ",setsar=1:1,setpts=PTS-STARTPTS[v" + i + "];";
	}
	for (var i = 0; i < filePaths.length; i++) {
		str += "[v" + i + "][" + i + ":a]";
	}
	str += (" concat=n=" + filePaths.length + ":v=1:a=1 [v][a]\" -map \"[v]\" -map \"[a]\" -preset " + processingInfo.encoding_speed + " " + destinationPath + ".mp4");

	if (!processingInfo.display_logs) {
		str += " 2> /dev/null";
	}

	return str;
}
