var seam = [];

function seamCarving() {
  if (frameCount%2 == 0)
    rotateImage();

  img.loadPixels();

  var sobelData = getSobelData(img.imageData, seam);
  var energyData = getEnergyArray(sobelData);
  seam = getSeamIndex(energyData);
  createNewPixelArray(seam);

  if (frameCount%2 == 0) 
    rotateImage();
}

function rotateImage() {
  img.loadPixels();
  var newPixelArray = rotatePixelArray(img.pixels,img.width,img.height);
  img = createImage(img.height, img.width);
  img.loadPixels();
  for(var i=0;i<img.pixels.length;i++)
    img.pixels[i] = newPixelArray[i];
  img.updatePixels();
}

function getSobelData(imageData, seam) {
  var sobel = Sobel(imageData, seam);
  var sobelData = sobel.toImageData();
  return sobelData;
}

function getEnergyArray(sobelData) {
  var energyArray = createArray(sobelData.width, sobelData.height);
  var image = sobelData.data;

  for(var y=0;y<sobelData.height;y++) {
    for(var x=0;x<sobelData.width;x++) {
      var index = (x+y*sobelData.width)*4;
      realNeighbors = [];
      if (y-1>=0) {
        realNeighbors.push(energyArray[x][y-1]);

        if (x-1>=0)
          realNeighbors.push(energyArray[x-1][y-1]);

        if (x+1<sobelData.width)
          realNeighbors.push(energyArray[x+1][y-1]);
      }
      energyArray[x][y] = realNeighbors.length? image[index] + min(realNeighbors) : image[index];
    }
  }

  return energyArray;
}


function getSeamIndex(energyArray) {
  var pixelXY = [];

  // Find Minimum on bottom row
  var lastRow = energyArray[0].length-1;
  var minIndex = 0;
  var minVal = energyArray[minIndex][lastRow];
  for(var x=1;x<energyArray.length;x++) {
    if (energyArray[x][lastRow] <= minVal) {
      minVal = energyArray[minIndex][lastRow];
      minIndex = x;
    }
  }
  pixelXY.push([minIndex, lastRow]);
  
  // Work our way up from bottom row
  for(var y=lastRow;y>0;y--) {
    currentX = pixelXY[pixelXY.length - 1][0];
    northWest = currentX-1>=0 ? energyArray[currentX-1][y-1] : Infinity;
    north = energyArray[currentX][y-1];
    northEast = currentX+1<energyArray.length ? energyArray[currentX+1][y-1] : Infinity;
    minVal = min(northWest, north, northEast);

    if (minVal == northWest)
      currentX--;
    else if (minVal == northEast)
      currentX++;

    pixelXY.push([currentX, y-1])
  }

  // Need to convert from pixelXY to rgba 
  var rgbaIndexes = []
  for (var i=0;i<pixelXY.length;i++) {
    var x = pixelXY[i][0];
    var y = pixelXY[i][1];
    var index = (x+y*energyArray.length)*4;
    rgbaIndexes.push(index+3, index+2, index+1, index);
  }

  return rgbaIndexes;
}

function createNewPixelArray(seam) {
  img.loadPixels();
  var newPixelArray = removeSeam(seam.reverse(), img.pixels);
  img = createImage(img.width-1, img.height);

  img.loadPixels();
  for(var i=0;i<img.pixels.length;i++)
    img.pixels[i] = newPixelArray[i];
  img.updatePixels();
}