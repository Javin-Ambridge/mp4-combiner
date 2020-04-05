var Helpers = require('./helpers');

module.exports = {
	NoClipsToCombine: Helpers.WrapInError("There are no clips to combine."),
	OnlySingleClipToCombine: Helpers.WrapInError("There is only a single clip, nothing to combine."),
	NoFilesToGetSizes: Helpers.WrapInError("No files to get sizes from."),
	CantFindSingleWidHeight: Helpers.WrapInError("Couldn't find a single max width or height."),
	MaxWidthFoundDoesntMeetMinSpecified: Helpers.WrapInError("The Max Width found from the video files does not meet the minium value specified by the options passed on init."),
	MaxHeightFoundDoesntMeetMinSpecified: Helpers.WrapInError("The Max Height found from the video files does not meet the minium value specified by the options passed on init."),
	MaxFPSFoundDoesntMeetMinSpecified: Helpers.WrapInError("The Max FPS found from the video files does not meet the minium value specified by the options passed on init."),
	FileNotMP4: Helpers.WrapInError("A file inputted was not an MP4"),
	FileDNE: Helpers.WrapInError("A file does not exist")
};
