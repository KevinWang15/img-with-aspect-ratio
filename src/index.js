import bmpLib from './libs/bmp_lib'

let gcd = (a, b) => {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
};


let getBase64Image = (width, height) => {
    let _gcd = gcd(width, height);
    width /= _gcd;
    height /= _gcd;
    return bmpLib.imageSource(width, height);
};

let _create = (element, imageSrc, aspectWidth, aspectHeight,
               primaryAttribute = "width", primaryAttributeValue = "100%",
               { size = "contain", positionX = "center", positionY = "center", repeat = "no-repeat" } = {}) => {

    let image = document.createElement("img");

    if (primaryAttribute === 'height')
        image.style.width = 'auto';
    else if (primaryAttribute === 'width')
        image.style.height = 'auto';
    else
        throw "Invalid primaryAttribute, can only be 'width' or 'height'";

    image.src = getBase64Image(aspectWidth, aspectHeight);
    image.style[primaryAttribute] = '100%';
    image.style.margin = image.style.padding = "0";
    image.style.border = "none";
    image.style.opacity = 0;

    element.style.display = "inline-block";
    element.style.fontSize = "0";
    element.style.backgroundImage = `url(${imageSrc})`;
    element.style.backgroundSize = size;
    element.style.backgroundPosition = `${positionX} ${positionY}`;
    element.style.backgroundRepeat = repeat;

    element.style[primaryAttribute] = primaryAttributeValue;

    element.appendChild(image);
    return image;
};

export const create = _create;
