(function(root) {
  'use strict';

  function Sobel(imageData) {
    if (!(this instanceof Sobel)) {
      return new Sobel(imageData);
    }

    var width = imageData.width;
    var height = imageData.height;

    var kernelX = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    var kernelY = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];

    var data = imageData.data;
    var sobelData = new Uint8ClampedArray(data.length);
    var grayscaleData = new Uint8ClampedArray(data.length);

    function bindPixelAt(data) {
      return function(x, y, i) {
        i = i || 0;
        return data[((width * y) + x) * 4 + i];
      };
    }

    var pixelAt = bindPixelAt(data);
    var x, y;
    var counter = 0;

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var r = pixelAt(x, y, 0);
        var g = pixelAt(x, y, 1);
        var b = pixelAt(x, y, 2);

        var avg = (r + g + b) / 3;
        grayscaleData[counter++] = avg;
        grayscaleData[counter++] = avg;
        grayscaleData[counter++] = avg;
        grayscaleData[counter++] = 255;
      }
    }

    pixelAt = bindPixelAt(grayscaleData);

    counter = 0;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var pixelX = (
            (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
            (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
            (kernelX[1][0] * pixelAt(x - 1, y)) +
            (kernelX[1][2] * pixelAt(x + 1, y)) +
            (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
            (kernelX[2][2] * pixelAt(x + 1, y + 1))
        );

        var pixelY = (
          (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
          (kernelY[0][1] * pixelAt(x, y - 1)) +
          (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
          (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
          (kernelY[2][1] * pixelAt(x, y + 1)) +
          (kernelY[2][2] * pixelAt(x + 1, y + 1))
        );

        var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;

        sobelData[counter++] = magnitude;
        sobelData[counter++] = magnitude;
        sobelData[counter++] = magnitude;
        sobelData[counter++] = 255;
      }
    }

    var clampedArray = sobelData;

    if (typeof Uint8ClampedArray === 'function') {
      clampedArray = new Uint8ClampedArray(sobelData);
    }

    clampedArray.toImageData = function() {
      return Sobel.toImageData(clampedArray, width, height);
    };

    return clampedArray;
  }

  Sobel.toImageData = function toImageData(data, width, height) {
    if (typeof ImageData === 'function' && Object.prototype.toString.call(data) === '[object Uint16Array]') {
      return new ImageData(data, width, height);
    } else {
      if (typeof window === 'object' && typeof window.document === 'object') {
        var canvas = document.createElement('canvas');

        if (typeof canvas.getContext === 'function') {
          var context = canvas.getContext('2d');
          var imageData = context.createImageData(width, height);
          imageData.data.set(data);
          return imageData;
        } else {
          return new FakeImageData(data, width, height);
        }
      } else {
        return new FakeImageData(data, width, height);
      }
    }
  };

  function FakeImageData(data, width, height) {
    return {
      width: width,
      height: height,
      data: data
    };
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Sobel;
    }
    exports.Sobel = Sobel;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Sobel;
    });
  } else {
    root.Sobel = Sobel;
  }

})(this);

self.onmessage = function(event) {
  // Sobel constructor returns an Uint8ClampedArray with sobel data
  var sobelData = Sobel(imageData);

  self.postMessage(sobelData);
};