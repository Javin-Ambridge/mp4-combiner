var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
const Promise = require('bluebird');
var Errors = require('../errors/info-errors');
const fs = require('fs');

// Hydrate Process Info does the following:
// 1) Goes through all of the file paths specified, and gets the max height, width, fps
// 2) If the max width is greater than the others, choose that one
// 3) If the max FPS is greater than the others, choose that one
// This will more often than not return an optimal video
// 4) Compares this video file max values, against the minimum values specified by the caller
module.exports.hydrateProcessInfo = function(filePaths, minValues) {
	return new Promise(function(resolve, reject) {
		if (filePaths.length == 0) return reject(Errors.NoClipsToCombine);
		if (filePaths.length == 1) return reject(Errors.OnlySingleClipToCombine);

		var dimensions;

		return allFilesValid(filePaths)
		.then(function() {
			return getDimensionSizeWithPath(filePaths);
		})
		.then(function(dim) {
			dimensions = dim;

			return validateDimensions(dimensions, minValues);
		})
		.then(function() {
			return resolve(dimensions);
		})
		.catch(function(err) {
			return reject(err);
		});
	});
};

function validateDimensions(dimensions, minValues) {
	return new Promise(function(resolve, reject) {
		if (dimensions.max_width < minValues.minimum_width) {
			return reject(Errors.MaxWidthFoundDoesntMeetMinSpecified);
		} else if (dimensions.max_height < minValues.minimum_height) {
			return reject(Errors.MaxHeightFoundDoesntMeetMinSpecified);
		} else if (dimensions.max_fps < minValues.minimum_fps) {
			return reject(Errors.MaxFPSFoundDoesntMeetMinSpecified);
		}

		return resolve();
	});
}

function allFilesValid(filePaths) {
	return new Promise(function(resolve, reject) {
		
		var countIndex = 0;
		function next() {
			if (!filePaths[countIndex].endsWith(".mp4")) {
				return reject(Errors.FileNotMP4);
			}

			try {
				if (!fs.existsSync(filePaths[countIndex])) {
					return reject(Errors.FileDNE);
				}
			} catch (err) {
				return reject(err);
			}

			countIndex++;
			if (countIndex <= filePaths.length - 1) {
				return next();
			} else {
				return resolve();
			}

		}

		return next();
	});
}

function getDimensionSizeWithPath(filePaths) {
	return new Promise(function(resolve, reject) {
		var maxWidth = 0;
		var maxHeight = 0;
		var maxFrameRate = 0;

		var countIndex = 0;
		if (countIndex >= filePaths.length) return reject(Errors.NoFilesToGetSizes);

		function next() {
			return extractWidthHeightFromVideo(filePaths[countIndex]).then(function(dimensions) {
				let currentWidth = parseInt(dimensions[0]);
				let currentHeight = parseInt(dimensions[1]);
				let currentFPS = parseInt(eval(dimensions[2]));

				if (currentWidth >= maxWidth) {
					maxWidth = currentWidth;
					maxHeight = currentHeight;
				}
				if (currentFPS >= maxFrameRate) {
					maxFrameRate = currentFPS;
				}

				countIndex++;
				if (countIndex <= filePaths.length - 1) {
					return next();
				} else {
					if (maxWidth == 0 || maxHeight == 0 || maxFrameRate == 0) {
						return reject(Errors.CantFindSingleWidHeight);
					} else {
						return resolve({
							max_width: maxWidth,
							max_height: maxHeight,
							max_fps: maxFrameRate
						});
					}
				}
			})
			.catch(function(err) {
				return reject(err);
			});
		}

		return next();
	});
}

function extractWidthHeightFromVideo(pathToClip) {
	return new Promise(function(resolve, reject) {
		return ffprobe(pathToClip, {
			path: ffprobeStatic.path
		}, function(err, info) {
			if (err) {
				return reject(err);
			} else {
				if (!info || info.streams.length <= 0) {
					return resolve([0, 0, 0]);
				} else {
					return resolve([info.streams[0].width, info.streams[0].height, info.streams[0].r_frame_rate]);
				}
			}
		});
	});
}

