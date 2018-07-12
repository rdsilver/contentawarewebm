var gif;
var fileName = 'monaLisa.webm';
var gifSaved = false;

function initalizeGif() {
 gif = new CCapture({
    framerate: 72,
    quality: 90,
    format: 'webm',
    name: fileName,
    workersPath: 'gifLibrary/'
  });

  gif.start();
}

function captureGifFrame() {
	gif.capture(canvas.elt);
}

function doneRendering(blob) {
  saveGif(blob);
}

function isGifSaved() {
  return gifSaved;
}

function createGif() {
  gif.save(doneRendering);
  gifSaved = true;
}

function saveGif(blob) {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();

  if (/Edge\/\d./i.test(navigator.userAgent))
    navigator.msSaveOrOpenBlob(blob, fileName);

  window.URL.revokeObjectURL(url);
};