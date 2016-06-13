# SVGMaster

SVGMaster is a utility library to help streamlining the use of svg graphical assets (icons/backgrounds) in a html page.

It 
* defines a workflow based on a single svg library containing all the assets (1 single HTTP request)
* avoid the need of creating svg spritesheet of create multiple `<use />` instances of the defined symbols
* Let you export directly from illustrator or build the library with any script (including grunt and gulp) to concatenate moltiple svg files into a single library
* It manages compatibility issues across browsers, replacing the dom elements with inline svg snippets using a single `<use />` tag inside to have 100% compatibility with modern browser
* It allows to easily use an svg as background. It actually base64 encode and inline svg data into the background css property to grant again max compatibility
* svgs can be easily manipulated via css to add transitions or change color properties
* it is totally transparent to the developer
* it creates a showcase of all the icons contained in the library to easy preview and lookup ids, that can be easily triggered programmatically from source code or via browser console for debugging

## Getting started

1. Download SVGMaster.js or SVGMaster.min.js from the dist folder and include it in your page at the end of the body
2. Download SVGMaster.css or SVGMaster.min.css from the dist folder and include it in your page in the head tag
3. Place a `<link rel="svgmaster" href="{path/to/svg_library.svg}" />` in the head
4. For icons: use `<i class="icon icon-calendar" />` in you html. (being "i.icon") the default selector for icons and being "calendar" the id of the svg `<symbol />` in the library
5. For backgrounds: assign `class="iconBg icon-calendar"` to any html element. (being ".iconBg") the default selector for backgrounds and being "calendar" the id of the svg `<symbol />` in the library

This way the css and the svg library will already be cached by the browser when the script gets executed.
SVGMaster initialize itself when loaded, reload the library via ajax that should be already cached by the browser and when done call the update method that transforms all the selected markup for icons and backgrounds in svg elements. Any further call of the update() function will only transform elements which has not been parsed yet. After every append to the DOM of an element that needs an icon the update() menthod should be called. 
SVGMaster doesn't perform any polling to check updates to the page.


