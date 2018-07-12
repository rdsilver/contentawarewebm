var img;
var startingWidth;
var startingHeight;

function preload() {
  img = loadImage("assets/who.jpg");
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(img.width, img.height);
  canvas.parent('sketch');
  startingWidth = img.width;
  startingHeight = img.height
  initalizeGif();
}

function draw() {
  if (img.height>50 && img.width>50) {
    //scale(width/startingWidth, height/startingHeight);
    scale(startingWidth/img.width, startingHeight/img.height);
    image(img, 0, 0);
    captureGifFrame();
    seamCarving();
  } else if (!isGifSaved()) {
    createGif();
  }
}