var direction = 'horizontal';

function seamCarving() {
  img.loadPixels();
  var imageData = new ImageData(img.pixels, img.width, img.height);
  var seam = getSeam(getSobelData(imageData));
  removeSeam(seam);
}

function getSobelData(imageData) {
  var sobel = Sobel(imageData);
  var sobelData = sobel.toImageData();
  return sobelData;
}

function getSeam(sobelData) {
  var energyArray;
  var seam;

  if (direction == 'vertical') {
    energyArray = getVerticalEnergyArray(sobelData);
    seam = getVerticalSeamIndex(energyArray);
  } else {
    energyArray = getHorizontalEnergyArray(sobelData);
    energyArray = transpose(energyArray);
    seam = getVerticalSeamIndex(energyArray);
  }

  return seam;
}

function getVerticalEnergyArray(sobelData) {
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

function getHorizontalEnergyArray(sobelData) {
  var energyArray = createArray(sobelData.width, sobelData.height);
  var image = sobelData.data;

  for(var x=0;x<sobelData.width;x++) {
    for(var y=0;y<sobelData.height;y++) {
      var index = (x+y*sobelData.width)*4;
      realNeighbors = [];
      if (x-1>=0) {
        realNeighbors.push(energyArray[x-1][y]);

        if (y-1>=0)
          realNeighbors.push(energyArray[x-1][y-1]);

        if (y+1<sobelData.height)
          realNeighbors.push(energyArray[x-1][y+1]);
      }

      thisCellData = (index>sobelData.width*4 && index<sobelData.width*sobelData.height*4-(sobelData.width*4))? image[index] : 255;
      energyArray[x][y] = realNeighbors.length? thisCellData + min(realNeighbors) : thisCellData;
    }
  }

  return energyArray;
}

function getVerticalSeamIndex(energyArray) {
  var pixelXY = [];

  // Find Minimum on right column
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

function getHorizontalSeamIndex(energyArray) {
  var pixelXY = [];

  // Find Minimum on right row
  var rightRow = energyArray.length-1;
  var minIndex = 0;
  var minVal = energyArray[rightRow][minIndex];
  for(var y=1;y<energyArray[0].length-1;y++) {
    if (energyArray[rightRow][y] < minVal) {
      minVal = energyArray[rightRow][y];
      minIndex = y;
    }
  }
  pixelXY.push([rightRow, minIndex]);

  // Work our way left from right row
  for(var x=rightRow;x>0;x--) {
    currentY = pixelXY[pixelXY.length - 1][1];
    northWest = currentY-1>=0 ? energyArray[x-1][currentY-1] : Infinity;
    west = energyArray[x-1][currentY];
    southWest = currentY+1<energyArray[0].length ? energyArray[x-1][currentY+1] : Infinity;
    minVal = min(northWest, west, southWest);

    if (minVal == northWest)
      currentY--;
    else if (minVal == southWest)
      currentY++;

    pixelXY.push([x-1,currentY])
  }

  // Need to convert from pixelXY to rgba 
  var rgbaIndexes = []
  for (var i=0;i<pixelXY.length;i++) {
    var x = pixelXY[i][0];
    var y = pixelXY[i][1];
    var index = (x+y*energyArray.length)*4;
    rgbaIndexes.push(index, index+1, index+2, index+3);
  }

  return rgbaIndexes.sort(function(a, b){return b - a});
}

function removeSeam(seam) {
  img.loadPixels();
  var newPixelArray = createNewPixelArray(seam, img.pixels).reverse();

  if (direction == 'vertical')
    img = createImage(img.width-1, img.height);
  else
    img = createImage(img.width, img.height-1);

  img.loadPixels();
  for(var i=0;i<img.pixels.length;i++)
    img.pixels[i] = newPixelArray[i];
  img.updatePixels();
}

function createNewPixelArray(seam, pixels) {
  var newPixelArray = [];

  for(var i=pixels.length-1;i>=0;i--) {
    if (i != seam[0]) {
      newPixelArray.push(pixels[i]);
    } else {
      seam.shift();
    }
  }

  return newPixelArray;
}

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
      return a.map(function(r) { return r[c]; });
  });
}