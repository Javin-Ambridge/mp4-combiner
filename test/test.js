var assert = require('assert');
var should = require('should');
var errors = require('../errors/info-errors');

const Combiner = require('../mp4-combiner');

var outputFile = "./test/output/testoutput-";
var filePrefix = "./test/input/";
var files = {
	badFile: filePrefix + "badfile.txt",
	dneFile: filePrefix + "filedne.mp4",
	sampleVideo1: filePrefix + "sample_video_1.mp4",
	sampleVideo2: filePrefix + "sample_video_2.mp4",
};

describe("Combining Files", function() {
	it("Combine with no files", (done) => {
		var combiner = Combiner({});
		combiner.Combine([], outputFile)
		.then(function() {})
		.catch(function(err) {
			err.should.be.equal(errors.NoClipsToCombine);

			done();
		});
	});
	it("Combine with one files", (done) => {
		var combiner = Combiner({});
		combiner.Combine([files.badFile], outputFile)
		.then(function() {})
		.catch(function(err) {
			err.should.be.equal(errors.OnlySingleClipToCombine);
			
			done();
		});
	});
	it("Combine with bad file", (done) => {
		var combiner = Combiner({});
		combiner.Combine([files.badFile, files.badFile], outputFile)
		.then(function() {})
		.catch(function(err) {
			err.should.be.equal(errors.FileNotMP4);
			
			done();
		});
	});
	it("Combine with non existant file", (done) => {
		var combiner = Combiner({});
		combiner.Combine([files.dneFile, files.badFile], outputFile)
		.then(function() {})
		.catch(function(err) {
			err.should.be.equal(errors.FileDNE);
			
			done();
		});
	});
	it("Success", (done) => {
		var combiner = Combiner({
			min_height: 360,
			display_logs: true
		});
		combiner.Combine([files.sampleVideo1, files.sampleVideo1], outputFile + Date.now())
		.then(function() {
			done();
		})
		.catch(function(err) {});
	});
	it("Success #2", (done) => {
		var combiner = Combiner({
			min_height: 360,
			display_logs: true
		});
		combiner.Combine([files.sampleVideo1, files.sampleVideo2, files.sampleVideo1], outputFile + Date.now())
		.then(function() {
			done();
		})
		.catch(function(err) {});
	});
	it("Success #3 - with overrides", (done) => {
		var combiner = Combiner({
			min_height: 360,
			display_logs: true,
			fps_override: 10,
			height_override: 150,
			width_override: 200,
		});
		combiner.Combine([files.sampleVideo1, files.sampleVideo2, files.sampleVideo1], outputFile + Date.now())
		.then(function() {
			done();
		})
		.catch(function(err) {});
	});
});
