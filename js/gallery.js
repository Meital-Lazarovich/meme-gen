'use strict';

function initGallery() {
    createImgs();
}

function onSelectImg(imgIdx) {
    createMeme(imgIdx);
    window.location = 'editor.html';
    initCanvas();
}



