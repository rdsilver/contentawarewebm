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
}
