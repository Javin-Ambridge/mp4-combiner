


# MP4 Combiner - NPM Utility to Combine 2-N Mp4 files

[![npm package](https://nodei.co/npm/mp4-combiner.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mp4-combiner/)

## Simple to use
MP4 Combiner is designed to be as simple to use as possible, the minimum you need to do to get this utility working is pass a path to a list of mp4 files, and pass a final output path.

This utility uses the heavyweight FFMPEG linux library to do the actual video processing. 

This utility uses FFProbe to determine media file properties, which can automatically determine the highest quality (Height/Width + FPS).

Users can also optionally pass in overrides to FPS, Height, and Width values. 

Simple API usage:

``` js
var ouputFileName = outputFile + Date.now();

var combiner = Combiner({
	
	// Override the Minium FPS allowed (if no override set)
	min_fps: 24,

	// Override the Minimum Height allowed (if no override set)
	min_height: 360,

	// Override the Minimum Width allowed (if no override set)
	min_height: 600,

	// Override the processing speed (how slow/carefully FFMPEG does the video processing)
	encoding_speed: "fast",

	// Display the logs from FFMPEG
	display_logs: true,

	// Override the output FPS
	fps_override: 10,

	// Override the output Height
	height_override: 150,

	// Override the output Width
	width_override: 200,
});
combiner.Combine([files.sampleVideo1, files.sampleVideo2, files.sampleVideo1], ouputFileName)
.then(function() {
	console.log("You will now have a file at " + ouputFileName ".mp4");
})
.catch(function(err) {
	console.log("Error combining MP4 files: ", err);
});
```

## Table of Contents
- [Setup and Configuration](#setup-and-configuration)
- [Determining Output Media Info](#determining-output-media-info)
- [Advice](#advice)
- [Playing Around](#playing-around)
- [Final Notes](#final-notes)

## Setup and Configuration
### Installing reddit-wrapper-v2
``` bash
npm install mp4-combiner --save
```

### Library usage and configuration
``` js
var Combiner = require('mp4-combiner');

var combiner = Combiner({
	min_fps: 24,
	min_height: 360,
	min_height: 600,
	encoding_speed: "fast",
	display_logs: true,
	fps_override: 10,
	height_override: 150,
	width_override: 200,
});
```

### Options
| Option | Default | Description |
|--|--|--|
| min_fps | 24 | The Minimum FPS allowed.<br><br>If an FPS override is set, this has no effect. |
| min_height | 600 | The Minimum Height allowed.<br><br>If a Height override is set, this has no effect. |
| min_width | 600 | The Minimum Width allowed.<br><br>If a Width override is set, this has no effect. |
| encoding_speed | medium | The FFMPEG Encoding Speed.<br><br>Has to be one of the following presets: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow.<br><br>*Be careful using faster encoding presets, this will potentially cause frame drops, or other issues. Use at your own risk.* |
| display_logs | false | Display the FFMPEG Logs during Encoding.<br><br>Completely optional, for testing we would recommend keeping them on. |
| fps_override | | Sets the output FPS. |
| height_override | | Sets the output Height. |
| width_override | | Sets the output Width. |


## Determining Output Media Info

If no Overrides are set for FPS, Width, and Height this utility will do its best to determine the optimal output video. 

The process of determining this optimal video is looping through all of the input files, extracting media information with FFProbe, extracting the largest width (width and height are paired, so largest width video's height will be the chosen height), and extracting the highest FPS.

An example of how this would look is the following:
Video #1: Width 600, Height: 600, FPS 15
Video #2: Width: 1280, Height: 720, FPS: 24
Video #3: Width: 1080, Height: 729, FPS: 30

The final video will have the following info:
Width: 1280, Height: 720, FPS: 30

You can always override these values if you so choose, this is just our attempt to help reducing developer overhead if all the videos are similar dimensions.

## Advice

We have the following advice for developers using this Utility:
 - Try your best to make all of the video files be similar dimensions (width, height, fps)
 - If you care a ton about video quality, but not as much about how quick the video encoding takes, you may choose to set the encoding preset to be closer to the veryslow side.
 - If you care mostly about video encoding performance (ie. How quick it takes to combine mp4 files) you may choose to set the encoding preset to be closer to the ultrafast side.
 - The more cores/the better your CPU is, the quicker your encoding will be. (You can also look into utilizing your GPU to process, however, that is out of the scope of this package)
 - Processing large video files takes up RAM, so the the more RAM you have the better. 
 - We have found lots of value in offloading these processing jobs to AWS Batch.

## Playing Around

If you just want to play around with this utility, to see how it works, to see what optimal settings may be, etc. Clone the underlying repository and update the testing directory.

Add a new test similar to the test called "Success #3 - with overrides", adding your own mp4 files you want to play around with.

To run the tests, in your linux shell type: mocha test

If you set everything up correctly, you will start seeing the tests being run sequentially, your test will execute at the end, once done, you can find the combined video file.

## Final Notes
- This relies on Bluebird promises.
- Feel free to make feature requests, bugs, etc. I will try to be as prompt at fixing/getting back to you.