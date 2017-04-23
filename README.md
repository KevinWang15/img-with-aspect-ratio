img-with-aspect-ratio
===========================

An unconventional but great JavaScript solution for "image resize and keep aspect ratio".

# Demo
[Check out the demo!](https://cdn.rawgit.com/KevinWang15/img-with-aspect-ratio/000576ed/dist/demo.html)

# How it works
It generates an image with certain aspect ratio in memory, uses the image to make the browser calculate the width/height of the element and recalculate & apply them automatically when resized (keeping the aspect ratio).

# Advantages
* Once set up, no JavaScript is needed any more.
* No obscure css, plays well with other css (e.g. max-width/min-width/media query).
* Good compatibility across browsers, supports IE8.
* Customizable crop options (crop/contain/position).
* Supports all css units, 200px or 100%.
* Reasonably good performance.
* Only 1.8kb gzipped.

# Installation
Download [dist/img-with-aspect-ratio.min.js](https://raw.githubusercontent.com/KevinWang15/img-with-aspect-ratio/master/dist/img-with-aspect-ratio.min.js) and include it in the HTML.

# API
```javascript
window.ImgWithAspectRatio.create
               (element, imageSrc, aspectWidth, aspectHeight,
                   primaryAttribute = "width", primaryAttributeValue = "100%",
                   { size = "contain", positionX = "center", positionY = "center", repeat = "no-repeat" } = {}
               );
```

## element
DOM element, e.g.
```javascript
window.document.getElementById('myImg');
```

## imageSrc
URL of the image.

## aspectWidth, aspectHeight
Both are numbers, together they determine the aspect ratio.

## primaryAttribute
According to which attribute should the image resize.
Must be set to either ```width``` or ```height```.

The attribute specified in the ```primaryAttribute``` can later be modified by css or js and produce correct results.

Default value is ```width```.

## primaryAttributeValue
The value of the attribute specified in the ```primaryAttribute```, supports all css length units (e.g. ```50%```, ```200px```).

Default value is ```100%```.

Can be set to "" (empty string) if you wish to specify it in CSS and don't wish to use ```!important```.

## imageOptions (last parameter)
The same as corresponding css background properties.

Check out [w3schools css reference](https://www.w3schools.com/cssref/css3_pr_background.asp) if you are not familiar with them.

# Performance tips
Since in-memory generation of an image is involved, performance is affected by the total pixels of the image.

For the best performance, make ```aspectWidth```/```gcd``` and ```aspectHeight```/```gcd``` as small as possible (where ```gcd``` stands for ```Greatest Common Divisor``` of ```aspectWidth``` and ```aspectHeight```), so that only an image of (```aspectWidth```/```gcd```) * (```aspectHeight```/```gcd```) px is needed.

In other words, make their ```gcd``` as big as possible.

Remember, ```aspectWidth```=10000,```aspectHeight```=6000 is ```4,000,000 times``` faster and more memory-efficient than ```aspectWidth```=10000,```aspectHeight```=6001 ! 

# TODOs
- [ ] JavaScript reconfiguration API. 
- [ ] jQuery plugin. 
- [ ] AngularJS directive. 
- [ ] Angular 2 component. 
- [ ] React component. 

