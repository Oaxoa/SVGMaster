# SVGMaster

> SVGMaster is a utility library to help streamlining the use of svg graphical assets (icons/backgrounds) in a html page.

[Demo page](https://oaxoa.github.io/SVGMaster)

[![License][license-image]][license-url]

It 
* defines a workflow based on a single svg library containing all the assets (1 single HTTP request)
* avoids the need of creating svg spritesheet of create multiple `<use />` instances of the defined symbols
* let you export directly from illustrator or build the library with any script (including grunt and gulp) to concatenate moltiple svg files into a single library
* manages compatibility issues across browsers, replacing the dom elements with inline svg snippets using a single `<use />` tag inside to have 100% compatibility with modern browser
* allows to easily use an svg as background. It actually base64 encode and inline svg data into the background css property to grant max compatibility
* generates svgs that can be easily manipulated via css to add transitions or change color properties
* is totally transparent to the developer
* creates a showcase of all the icons contained in the library to easy preview and lookup ids, that can be easily triggered programmatically from source code or via browser console for debugging
* Only one dependency (jQuery)

## Getting started

1. Download SVGMaster.js or SVGMaster.min.js from the dist folder and include it in your page somewhere near the end of the body or eventually in the head
2. Download SVGMaster.showcase.css or SVGMaster.showcase.min.css from the dist folder and include it in your page in the head tag (optional, usually suited for development time and not needed in production)
3. Place a `<link rel="svgmaster" href="{path/to/svg_library.svg}" />` in the head
4. For icons: use `<i class="icon icon-calendar" />` in you html. (being "i.icon") the default selector for icons and being "calendar" the id of the svg `<symbol />` in the library
5. For backgrounds: assign `class="iconBg icon-calendar"` to any html element. (being ".iconBg") the default selector for backgrounds and being "calendar" the id of the svg `<symbol />` in the library
6. Consider enabling GZip on the server. SVG is text based so it has no compression and often GZip can compress it around 65%

This way the css and the svg library will already be cached by the browser when the script gets executed.
SVGMaster initialize itself when loaded, reload the library via ajax that should be already cached by the browser and when done call the update method that transforms all the selected markup for icons and backgrounds in svg elements. Any further call of the update() function will only transform elements which has not been parsed yet. After every append to the DOM of an element that needs an icon the update() menthod should be called. 
SVGMaster doesn't perform any polling to check updates to the page.


[license-image]: https://img.shields.io/badge/license-APACHE2-green.svg?style=flat-square
[license-url]: LICENSE