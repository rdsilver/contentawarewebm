var img;
var startingWidth;
var startingHeight;

function preload() {
  img = loadImage("assets/monaLisa.jpg");
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(img.width, img.height);
  canvas.parent('sketch');
  startingWidth = img.width;
  startingHeight = img.height;
  image(img, 0, 0);
  initalizeGif();
}

function draw() {
  if (img.width > 10) {
    captureGifFrame();
    scale(startingWidth/img.width, startingHeight/img.height);
    seamCarving();
    image(img, 0, 0);
  } else if (!isGifSaved()) {
    createGif();
  }
}