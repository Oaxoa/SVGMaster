(function() {
	var SVGMaster = (function() {
		'use strict';

		var NS_SVG = 'http://www.w3.org/2000/svg';
		var NS_XLINK = 'http://www.w3.org/1999/xlink';

		var ATTRIBUTE_CLASS = 'class';
		var ATTRIBUTE_PARSED = 'data-svgmaster-parsed';
		var ATTRIBUTE_HREF = 'href';
		var ATTRIBUTE_ID = 'id';
		var REGEXP_ICON_ID = /icon-([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)/;
		var REGEXP_TEMPLATE = /{{([^}}]+)}}/g;

		var TEMPLATE_DEFAULT_LIBRARY_LINK = 'link[rel="{{attributes}}"]';
		var TEMPLATE_SVG_BASE64_CONTENT = 'url(data:image/svg+xml;base64,{{content}})';
		var TEMPLATE_SVG_BASE64 = '<svg xmlns="' + NS_SVG + '"  xmlns:xlink="' + NS_XLINK + '" width="10" height="10">{{style}}{{symbol}}<use xlink:href="#iconSymbol-{{iconID}}" width="100%" height="100%" /></svg>';
		var TEMPLATE_SVG_INLINE = '<svg class="{{class}}"><use xlink:href="#iconSymbol-{{iconID}}" width="100%" height="100%" /></svg>';
		var CLASS_SHOWCASE = 'SVGMasterShowcase';
		var TEMPLATE_SHOWCASE = '<div class="SVGMasterWrapper"><div class="' + CLASS_SHOWCASE + '"><header>{{headerTitle}}</header><ul class="SVGMasterShowcaseList">{{contents}}</ul><footer></footer></div></div>';
		var TEMPLATE_SHOWCASE_ITEM = '<li class="SVGMasterShowcaseItem"><i class="icon icon-{{id}}"></i><span title="{{title}}">{{title}}</span></li>';
		var STRING_DEFAULT_LIBRARY_REL = 'svgmaster prefetch';
		var STRING_AJAX_DATATYPE = 'text';
		var STRING_ICON_SYMBOL_PREFIX = 'iconSymbol-';
		var TAG_SYMBOL = 'symbol';
		var TAG_USE = 'use';
		var TAG_STYLE = 'style';
		var TAG_TITLE = 'title';

		var SELECTOR_DEFAULT_ICON = 'i.icon';
		var SELECTOR_DEFAULT_BG = '.iconBg';
		var SELECTOR_SHOWCASE_WRAPPER = '.SVGMasterWrapper';

		var iconsSelector = SELECTOR_DEFAULT_ICON;
		var bgsSelector = SELECTOR_DEFAULT_BG;
		var libraryURL;
		var library;
		var head;
		var body;

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
		function setIconSelector(selector) {
			iconsSelector = selector;
		}
		/**
		 * Gets the icons selector pattern to match in jQuery selector format
		 * @return {String} The selector string
		 */
		function getIconSelector() {
			return iconsSelector;
		}
		/**
		 * Sets the backgrounds selector pattern to match in jQuery selector format
		 * @param {String} selector The selector string
		 */
		function setBackgroundSelector(selector) {
			bgsSelector = selector;
		}
		/**
		 * Gets the backgrounds selector pattern to match in jQuery selector format
		 * @return {String} The selector string
		 */
		function getBackgroundSelector() {
			return bgsSelector;
		}
		/**
		 * Parses icons and background (only if not already parsed)
		 * @param  {jQuery} [target] Set it to narrow the search to descendants of this element. If falsy defaults to the body element
		 */
		function update(target) {
			replaceIcons(target);
			replaceBackgrounds(target);
		}
		/**
		 * Returns the icon id given a class attribute value
		 * @param  {String} classStr Class attribute value
		 * @return {String}          The icon id
		 */
		function getIconID(classStr) {
			return classStr.match(REGEXP_ICON_ID)[1];
		}
		/**
		 * Retrieves the matching icon elements, without performing any operation
		 * @param  {jQuery} [target] A jquery element to limit the search. If not provided defaults to the body element
		 * @return {jQuery} A jQuery collection of matching elements
		 */
		function getIconElements(target) {
			// target parameter is checked here instead than in the update() method so that the function can be used publicly
			body = $('body');
			target = target || body;
			return target.find(iconsSelector).not('[' + ATTRIBUTE_PARSED + ']');
		}
		/**
		 * Retrieves the matching background elements, without performing any operation
		 * @param  {jQuery} [target] A jquery element to limit the search. If not provided defaults to the body element
		 * @return {jQuery} A jQuery collection of matching elements
		 */
		function getBackgroundElements(target) {
			// target parameter is checked here instead than in the update() method so that the function can be used publicly
			body = $('body');
			target = target || body;
			return target.find(bgsSelector).not('[' + ATTRIBUTE_PARSED + ']')
		}
		/**
		 * Replace elements matching IconsSelector selector with the svg item while keeping the classes
		 * @param  {jQuery} target Narrows the search to descendants of this element
		 */
		function replaceIcons(target) {
			getIconElements(target).each(function() {
				var currClass = $(this).attr(ATTRIBUTE_CLASS);
				var iconID = getIconID(currClass);
				var replacement = $(template(TEMPLATE_SVG_INLINE, {
					class: currClass,
					iconID: iconID
				}));
				replacement.attr(ATTRIBUTE_PARSED, true);
				$(this).replaceWith(replacement);
			});
		}
		/**
		 * Parses elements matching BgsSelectors inlining the svg content as (base64 encoded) background-url property
		 * @param  {jQuery} target Narrows the search to descendants of this element
		 */
		function replaceBackgrounds(target) {
			getBackgroundElements(target).each(function() {
				var currClass = $(this).attr(ATTRIBUTE_CLASS);
				var iconID = getIconID(currClass);
				library = $('#library');
				var matches = library.find('#' + STRING_ICON_SYMBOL_PREFIX + iconID);
				var symbolSVG = outerHtml(matches);
				var matchesStyle = library.find(TAG_STYLE);
				var styleSVG = '';
				if (matchesStyle.length > 0) {
					styleSVG = outerHtml(matchesStyle);
				}

				var outSvg = template(TEMPLATE_SVG_BASE64, {
					style: styleSVG,
					symbol: symbolSVG,
					iconID: iconID
				});
				$(this).css({
					'background-image': template(TEMPLATE_SVG_BASE64_CONTENT, {
						content: btoa(outSvg)
					})
				});
				$(this).attr(ATTRIBUTE_PARSED, true);
			});
		}
		/**
		 * Gets the url of the library specified in the <link rel="svgmaster" /> href attribute
		 * @return {String} The url of the default library
		 */
		function getDefaultLibraryURL() {
			var link = $(template(TEMPLATE_DEFAULT_LIBRARY_LINK, {
				attributes: STRING_DEFAULT_LIBRARY_REL
			}));
			return link.attr(ATTRIBUTE_HREF);
		}
		/**
		 * Load library and invoke the update method when done
		 * @param  {String} [url] The url of the library to load. If falsy the default library specified via <link rel="svgmaster" /> will be used
		 */
		function loadLibrary(url) {
			// it could eventually manage multiple libraries or make customizable the id/class of the library
			// or eventually use in page svg libraries instead of external resources but inlining would be discouraged 
			// to enforce caching.
			url = url || getDefaultLibraryURL();
			libraryURL = url;
			if (url && typeof $.ajax !== 'undefined') {
				$.ajax({
					url: libraryURL,
					dataType: STRING_AJAX_DATATYPE
				}).done(function(res) {
					head = $('head');
					head.append(res);
					library = $('#library');
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
			var showcaseContent = template(TEMPLATE_SHOWCASE, {
				contents: getShowcaseContents(),
				headerTitle: libraryURL
			});
			body = $('body');
			body.append($(showcaseContent));
			// replace only icons on specific target. Backgrounds are not used in the showcase
			replaceIcons($('.' + CLASS_SHOWCASE));
		}
		/**
		 * Hides the showcase dialog
		 */
		function hideShowcase() {
			$(SELECTOR_SHOWCASE_WRAPPER).remove();
		}
		/**
		 * Prepares the markup to be appended to the showcase dialog
		 * @return {String} string representation of the markup to be appended to the DOM
		 */
		function getShowcaseContents() {
			var out = '';
			library = $('#library');
			library.find(TAG_SYMBOL).each(function() {
				var t = $(this);
				var title = t.find(TAG_TITLE).text();
				var id = t.attr(ATTRIBUTE_ID).split(STRING_ICON_SYMBOL_PREFIX).join('');
				out += template(TEMPLATE_SHOWCASE_ITEM, {
					title: title,
					id: id
				});
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
			var out = templateStr;
			var regexp = REGEXP_TEMPLATE;
			var result;
			while (result !== null) {
				result = regexp.exec(templateStr);
				if (result !== null) {
					var matchObj = {
						match: result[0],
						variable: result[1]
					};
					out = out.replace(matchObj.match, dataObj[matchObj.variable]);
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

		// PUBLIC API
		return {
			getIconElements: getIconElements,
			getBackgroundElements: getBackgroundElements,
			replaceIcons: replaceIcons,
			replaceBackgrounds: replaceBackgrounds,
			update: update,
			loadLibrary: loadLibrary,
			setIconSelector: setIconSelector,
			getIconSelector: getIconSelector,
			setBackgroundSelector: setBackgroundSelector,
			getBackgroundSelector: getBackgroundSelector,
			showcase: showcase,
			hideShowcase: hideShowcase,
			getDefaultLibraryURL: getDefaultLibraryURL
		};
	})();

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = SVGMaster;
	} else {
		window.SVGMaster = SVGMaster;
	}
})();