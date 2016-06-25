var SVGMaster=(function() {
	'use strict';

	var TEMPLATE_SHOWCASE='<div class="SVGMasterWrapper"><div class="SVGMasterShowcase"><header>{{headerTitle}}</header><ul class="SVGMasterShowcaseList">{{contents}}</ul><footer></footer></div></div>';
	var NS_SVG='http://www.w3.org/2000/svg';
	var NS_XLINK='http://www.w3.org/1999/xlink';

	var ATTRIBUTE_CLASS='class';
	var ATTRIBUTE_PARSED='data-svgmaster-parsed';
	var ATTRIBUTE_HREF='href';
	var ATTRIBUTE_ID='id';
	var REGEXP_ICON=/icon-([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)/;

	var TEMPLATE_DEFAULT_LIBRARY_LINK='link[rel="{{attributes}}"]';
	var TEMPLATE_SVG_BASE64_CONTENT='url(data:image/svg+xml;base64,{{content}})';
	var TEMPLATE_SVG_BASE64='<svg xmlns="'+NS_SVG+'"  xmlns:xlink="'+NS_XLINK+'" width="10" height="10">{{style}}{{symbol}}<use xlink:href="#iconSymbol-{{iconID}}" width="100%" height="100%" /></svg>';
	var TEMPLATE_SVG_INLINE='<svg class="{{class}}"><use xlink:href="#iconSymbol-{{iconID}}" width="100%" height="100%" /></svg>';
	var TEMPLATE_SHOWCASE_ITEM='<li class="SVGMasterShowcaseItem"><i class="icon icon-{{id}}"></i><span title="{{title}}">{{title}}</span></li>';
	var STRING_DEFAULT_LIBRARY_REL='prefetch svgmaster';
	var STRING_AJAX_DATATYPE='text';
	var STRING_ICON_SYMBOL_PREFIX='iconSymbol-';
	var TAG_SYMBOL='symbol';
	var TAG_USE='use';
	var TAG_STYLE='style';
	var TAG_TITLE='title';
	var TAG_PARAGRAPH='p';
	var EVENT_CLICK='click';

	var SELECTOR_DEFAULT_ICON='i.icon';
	var SELECTOR_DEFAULT_BG='.iconBg';
	var SELECTOR_SHOWCASE_WRAPPER='.SVGMasterWrapper';

	var iconsSelector=SELECTOR_DEFAULT_ICON;
	var bgsSelector=SELECTOR_DEFAULT_BG;
	var libraryURL;
	var library=$('#library');
	var head=$('head');
	var body=$('body');

	init();

	/**
	 * Wrapper for the loadLibrary function
	 */
	function init() {
		loadLibrary();
	}

	/**
	 * Sets the icons selector pattern to match in jQuery selector format
	 * @param {String} selector The selector string
	 */
	function setIconsSelector(selector) {
		iconsSelector=selector;
	}
	/**
	 * Sets the backgrounds selector pattern to match in jQuery selector format
	 * @param {String} selector The selector string
	 */
	function setBgsSelector(selector) {
		bgsSelector=selector;
	}
	/**
	 * Parses icons and background (only if not already parsed)
	 * @param  {jQuery} [innerTarget] Set it to narrow the search to descendants of this element. If falsy defaults to the body element
	 */
	function update(innerTarget) {
		var target=innerTarget || body;
		replaceIcons(target);
		replaceBgs(target);
	}
	/**
	 * Replace elements matching IconsSelector selector with the svg item while keeping the classes
	 * @param  {jQuery} target Narrows the search to descendants of this element
	 */
	function replaceIcons(target) {
		target.find(iconsSelector).each(function() {
			var currClass=$(this).attr(ATTRIBUTE_CLASS);
			var iconID=currClass.match(/icon-([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)/)[1];
			$(this).replaceWith(template(TEMPLATE_SVG_INLINE, {class:currClass, iconID:iconID}));
		});
	}
	/**
	 * Parses elements matching BgsSelectors inlining the svg content as (base64 encoded) background-url property
	 * @param  {jQuery} target Narrows the search to descendants of this element
	 */
	function replaceBgs(target) {
		target.find(bgsSelector).not('['+ATTRIBUTE_PARSED+']').each(function() {
			var currClass=$(this).attr(ATTRIBUTE_CLASS);
			var iconID=currClass.match(REGEXP_ICON)[1];
			var matches=library.find('#'+STRING_ICON_SYMBOL_PREFIX+iconID);
			var symbolSVG=outerHtml(matches);
			var matchesStyle=library.find(TAG_STYLE);
			var styleSVG='';
			if(matchesStyle.length>0) {
				styleSVG=outerHtml(matchesStyle);
			}

			var outSvg=template(TEMPLATE_SVG_BASE64, {style:styleSVG, symbol:symbolSVG, iconID:iconID});
			$(this).css({
				'background-image': template(TEMPLATE_SVG_BASE64_CONTENT, {content:btoa(outSvg)})
			});
			$(this).attr(ATTRIBUTE_PARSED, true);
		});
	}
	/**
	 * Gets the url of the library specified in the <link rel="svgmaster" /> href attribute
	 * @return {String} The url of the default library
	 */
	function getDefaultLibraryURL() {
		var link=$(template(TEMPLATE_DEFAULT_LIBRARY_LINK, {attributes:STRING_DEFAULT_LIBRARY_REL}));
		return link.attr(ATTRIBUTE_HREF);
	}
	/**
	 * Load library and invoke the update method when done
	 * @param  {String} [url] The url of the library to load. If falsy the default library specified via <link rel="svgmaster" /> will be used
	 */
	function loadLibrary(url) {
		url = url || getDefaultLibraryURL();
		libraryURL=url;
		if(url) {
			$.ajax({url:libraryURL, dataType:STRING_AJAX_DATATYPE}).done(function(res) {
				head.append(res);
				library.find(TAG_USE).remove();
				head.append(library.find(TAG_STYLE).clone());
				update();
			});
		}
	}
	/**
	 * Opens the library showcase dialog
	 */
	function showcase() {
		var showcaseContent=template(TEMPLATE_SHOWCASE, {contents:getShowcaseContents(), headerTitle: libraryURL});
		body.append($(showcaseContent));
		update();
		$(SELECTOR_SHOWCASE_WRAPPER).on(EVENT_CLICK, hideShowcase);
	}
	/**
	 * Hides the showcase dialog
	 */
	function hideShowcase() {
		$(SELECTOR_SHOWCASE_WRAPPER).off(EVENT_CLICK).remove();
	}
	/**
	 * Prepares the markup to be appended to the showcase dialog
	 * @return {String} string representation of the markup to be appended to the DOM
	 */
	function getShowcaseContents() {
		var out='';
		library.find(TAG_SYMBOL).each(function() {
			var t=$(this);
			var title=t.find(TAG_TITLE).text();
			var id=t.attr(ATTRIBUTE_ID).split(STRING_ICON_SYMBOL_PREFIX).join('');
			out+=template(TEMPLATE_SHOWCASE_ITEM, {title:title, id:id});
		});
		return out;
	}
	/**
	 * Microtemplating function. Used in various places to build html strings
	 * @param  {String} templateStr The string containing template contents
	 * @param  {Object} dataObj Object used to populate the template
	 * @return {String} The final string assembled
	 */
	function template(templateStr, dataObj) {
		var out=templateStr;
		var regexp=/{{([^}}]+)}}/g;
		var result;
		while(result!==null) {
			result=regexp.exec(templateStr);
			if(result!==null) {
				var matchObj={match:result[0], variable:result[1]};
				out=out.replace(matchObj.match, dataObj[matchObj.variable]);
			}
		}
		return out;
	}
	/**
	 * Gets the "outer" html markup of a jquery object
	 * @param  {jQuery} jQueryObj The jQuery object we want to get the outer html of
	 * @return {String} The outer html content
	 */
	function outerHtml(jQueryObj) {
		return jQueryObj.clone().wrap('<p>').parent().html();
	}

	return {
		replaceIcons:replaceIcons,
		replaceBgs:replaceBgs,
		update:update,
		loadLibrary:loadLibrary,
		setBgsSelector:setBgsSelector,
		setIconsSelector:setIconsSelector,
		showcase:showcase
	};
})();