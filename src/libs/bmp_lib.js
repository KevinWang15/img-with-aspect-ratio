/**
 * Patched by Kevin Wang
 * Can only generate 1-bit color dummy images for special use.
 * for the original library visit http://neil.fraser.name/software/bmp_lib/
 */

/**
 * BMP Library for JavaScript
 *
 * Copyright 2008 Neil Fraser.
 * http://neil.fraser.name/software/bmp_lib/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var bmp_lib = {};

bmp_lib.imageSource = function (width, height) {
    var data = this.createBmp_(width, height);
    return 'data:image/bmp;base64,' + this.encode64_(data);
};

bmp_lib.strRepeat = function (str, qty) {
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
        if (qty & 1) result += str;
        qty >>= 1, str += str;
    }
    return result;
}

bmp_lib.createBmp_ = function (width, height) {
    // xxxx and yyyy are placeholders for offsets (computed later).
    var bitmapFileHeader = 'BMxxxx\0\0\0\0yyyy';

    // Assemble the info header.
    var biHeight = this.multiByteEncode_(height, 4);
    var biWidth = this.multiByteEncode_(width, 4);
    var bfOffBits = this.multiByteEncode_(40, 4);
    var bitCount = 1;
    var biBitCount = this.multiByteEncode_(bitCount, 2);
    var bitmapInfoHeader = bfOffBits + biWidth + biHeight + '\x01\0' +
        biBitCount + '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0';

    // Compute the palette.
    var rgbQuad = '\0\0\0\0\0\0\0\0';

    var padding;
    if (width % 4 == 1) {
        padding = '\0\0\0';
    } else if (width % 4 == 2) {
        padding = '\0\0';
    } else if (width % 4 == 3) {
        padding = '\0';
    } else {
        padding = '';
    }

    var data = [];
    let row = this.strRepeat('\x00', width);
    for (var y = 0; y < height; y++) {
        data[y] = row + padding;
    }
    data = data.join('');
    bitmapFileHeader = bitmapFileHeader.replace(/yyyy/, this.multiByteEncode_(
        bitmapFileHeader.length + bitmapInfoHeader.length + rgbQuad.length, 4));
    bitmapFileHeader = bitmapFileHeader.replace(/xxxx/, this.multiByteEncode_(62 + data.length, 4));
    return bitmapFileHeader + bitmapInfoHeader + rgbQuad + data;
};


bmp_lib.multiByteEncode_ = function (number, bytes) {
    // Thanks to Alexander Ivanov for efficiency improvements in this function.
    if (number < 0 || bytes < 0) {
        throw('Negative numbers not allowed.');
    }
    var string = '';
    for (var i = 0; i < bytes; i++) {
        // Extract one byte from the right.
        string += String.fromCharCode(number & 255);
        // Bitshift right one byte.
        number = number >> 8;
    }
    if (number != 0) {
        throw('Overflow, number too big for string length');
    }
    return string;
};

bmp_lib.encode64_ = function (input) {
    var output = '';
    var i = 0;

    do {
        var chr1 = input.charCodeAt(i++);
        var chr2 = input.charCodeAt(i++);
        var chr3 = input.charCodeAt(i++);

        var enc1 = chr1 >> 2;
        var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        var enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + bmp_lib.encode64_.keyStr.charAt(enc1) +
            bmp_lib.encode64_.keyStr.charAt(enc2) +
            bmp_lib.encode64_.keyStr.charAt(enc3) +
            bmp_lib.encode64_.keyStr.charAt(enc4);
    } while (i < input.length);

    return output;
};

bmp_lib.encode64_.keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

// Some browsers (Gecko, Webkit) have a native function for base64 encoding.
if ('btoa' in window && typeof window.btoa == 'function' &&
    window.btoa('hello') == 'aGVsbG8=') {
    // Overwrite previous function with native call.
    bmp_lib.encode64_ = function (input) {
        return window.btoa(input);
    }
}

export default bmp_lib;