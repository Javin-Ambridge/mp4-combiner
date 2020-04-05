const Info = require('./info-extractor');
const Encoder = require('./encoder');
const Promise = require('bluebird');

module.exports.init = function(options) {
	class Processer {
        constructor(options) {
        	this.min_values = {
				minimum_fps: isPresentAndIntegerElseDefault(options.min_fps, 24),
				minimum_width: isPresentAndIntegerElseDefault(options.min_width, 600),
				minimum_height: isPresentAndIntegerElseDefault(options.min_height, 600)
        	};

            this.encoding_speed = isPresentAndStringElseDefault(options.encoding_speed, "medium");
            this.display_logs = isPresentAndBoolElseDefault(options.display_logs, false);

            if (options.fps_override && Number.isInteger(options.fps_override)) {
                this.min_values.minimum_fps = 0;
                this.fps_override = options.fps_override;
            }
            if (options.height_override && Number.isInteger(options.height_override)) {
                this.min_values.minimum_height = 0;
                this.height_override = options.height_override;
            }
            if (options.width_override && Number.isInteger(options.width_override)) {
                this.min_values.minimum_width = 0;
                this.width_override = options.width_override;
            }
        }

        _combine(filePaths, destinationPath) {
            var self = this;
        	return new Promise(function(resolve, reject) {
                var processInfo;

    			Info.hydrateProcessInfo(filePaths, self.min_values)
    			.then(function(pInfo) {
    			    processInfo = pInfo;
    			    processInfo.encoding_speed = self.encoding_speed;
                    processInfo.display_logs = self.display_logs;

                    if (self.fps_override) {
                        processInfo.max_fps = self.fps_override;
                    }
                    if (self.height_override) {
                        processInfo.max_height = self.height_override;
                    }
                    if (self.width_override) {
                        processInfo.max_width = self.width_override;
                    }

                    return Encoder.encode(filePaths, processInfo, destinationPath);
    			})
                .then(function() {
                    return resolve();
                })
    			.catch(function(err) {
    				return reject(err);
    			});
        	});
        }

        Combine(filePaths, destinationPath) {
        	return this._combine(filePaths, destinationPath);
        }
	}

	return new Processer(options);
}

function isPresentAndIntegerElseDefault(val, defaultVal) {
	if (val && Number.isInteger(val)) {
		return val;
	}

	return defaultVal;
}

function isPresentAndStringElseDefault(val, defaultVal) {
    var presets = ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"];

    if (val && presets.indexOf(val) >= 0) {
        return val;
    }

    return defaultVal;
}

function isPresentAndBoolElseDefault(val, defaultVal) {
    if (val === true || val === false) {
        return val;
    }

    return defaultVal;
}
