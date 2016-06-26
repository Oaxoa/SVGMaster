var test = require('tape');
var fs = require('fs');
var cheerio = require('cheerio');

var file1=fs.readFileSync('./test/fixture/1.html');

global.$ = cheerio.load(file1);
global.btoa=require('btoa');

var SVGMaster=require('../src/SVGMaster.js');

test('Library exists', function (t) {
	t.plan(1);
	t.equal(typeof SVGMaster, 'object');
});
test('Find icon matches', function(t) {
	t.equal(SVGMaster.getIconElements().length, 1);
	t.end();
});
test('Find background matches', function(t) {
	t.equal(SVGMaster.getBackgroundElements().length, 1);
	t.end();
});
test('Don\'t retrieve twice an already parsed background', function(t) {
	SVGMaster.update();
	t.equal(SVGMaster.getBackgroundElements().length, 0);
	global.$ = cheerio.load(file1);
	t.equal(SVGMaster.getBackgroundElements().length, 1);
	t.end();
});