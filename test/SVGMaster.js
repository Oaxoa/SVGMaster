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
	t.equal(SVGMaster.getIconElements().length, 2);
	t.end();
});
test('Find background matches', function(t) {
	t.equal(SVGMaster.getBackgroundElements().length, 2);
	t.end();
});
test('Don\'t retrieve twice an already parsed background', function(t) {
	SVGMaster.update();
	t.equal(SVGMaster.getBackgroundElements().length, 0);
	// reset the DOM after transforming
	global.$ = cheerio.load(file1);
	t.end();
});
test('Replace icons in the whole body', function(t) {
	var iconsCount=SVGMaster.getIconElements().length;
	SVGMaster.update();
	var svgCount=$('svg.icon[data-svgmaster-parsed]').length;
	t.equal(iconsCount, svgCount);
	iconsCount=SVGMaster.getIconElements().length;
	t.equal(iconsCount, 0);
	// reset the DOM after transforming
	global.$ = cheerio.load(file1);
	t.end();
});
test('Replace icons in a specific element', function(t) {
	var target=$('#container2');
	var iconsCount=SVGMaster.getIconElements(target).length;
	SVGMaster.update(target);
	var svgCount=$('svg.icon[data-svgmaster-parsed]').length;
	t.equal(iconsCount, svgCount);
	// check how many are left. Should be 1
	iconsCount=SVGMaster.getIconElements().length;
	t.equal(iconsCount, 1);
	// reset the DOM after transforming
	global.$ = cheerio.load(file1);
	t.end();
});
test('Replace backgrounds in the whole body', function(t) {
	var backgroundsCount=SVGMaster.getBackgroundElements().length;
	SVGMaster.update();
	var replacedCount=$('.iconBg[data-svgmaster-parsed]').length;
	t.equal(backgroundsCount, replacedCount);
	backgroundsCount=SVGMaster.getIconElements().length;
	t.equal(backgroundsCount, 0);
	// reset the DOM after transforming
	global.$ = cheerio.load(file1);
	t.end();
});
test('Replace backgrounds in a specific element', function(t) {
	var target=$('#container2');
	var backgroundsCount=SVGMaster.getBackgroundElements(target).length;
	SVGMaster.update(target);
	var replacedCount=$('.iconBg[data-svgmaster-parsed]').length;
	t.equal(backgroundsCount, replacedCount);
	// check how many are left. Should be 1
	backgroundsCount=SVGMaster.getBackgroundElements().length;
	t.equal(backgroundsCount, 1);
	// reset the DOM after transforming
	global.$ = cheerio.load(file1);
	t.end();
});
test('Get the default library URL', function(t) {
	var libraryURL=SVGMaster.getDefaultLibraryURL();
	t.equal(libraryURL, 'library.svg');
	t.end();
});
test('Display/hide the showcase', function(t) {

	t.equal($('.SVGMasterShowcase').length, 0);

	SVGMaster.showcase();
	t.equal($('.SVGMasterShowcase').length, 1);

	SVGMaster.hideShowcase();
	t.equal($('.SVGMasterShowcase').length, 0);

	t.end();
});