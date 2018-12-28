function newSobel(imageData) {
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

  var sobelData = [];
  var grayscaleData = [];

  for (var i = 0; i<imageData.data; i+=4) {
    var avg = Math.round((imageData[i] + imageData[i+1] + imageData[i+2])/3);
    grayscaleData.push(avg, avg, avg, 255);
  }

  pixelAt = bindPixelAt(grayscaleData);

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

      sobelData.push(magnitude, magnitude, magnitude, 255);
    }
  }


}


function bindPixelAt(data) {
  return function(x, y, i) {
    i = i || 0;
    return data[((width * y) + x) * 4 + i];
  };
}
