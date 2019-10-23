'use strict';

let gCanvas;
let gCtx;
let gImgWidth;
let gImgHeight;

function init() {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
}

function renderImg() {
    let img = new Image();
    img.onload = function () {
        gImgWidth = img.width;
        gImgHeight = img.height;
        gCanvas.width = gImgWidth;
        gCanvas.height = gImgHeight;
        gCtx.drawImage(img, 0, 0);
        renderImgTxt(100);
    }
    img.src = getCurrImg().url;
}

function renderImgTxt(txtY) {
    let txt = getCurrTxt();
    gCtx.fillStyle = txt.color;
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 3;
    gCtx.font = `bold ${txt.size}px Impact`;
    let txtX;

    switch (txt.align) {
        case 'center':
            txtX = gImgWidth / 2;
            gCtx.textAlign = 'center';
            break;
        case 'right':
            txtX = gImgWidth;
            gCtx.textAlign = 'end';
            break;
        case 'left':
            txtX = 0;
            gCtx.textAlign = 'start';
            break;
    };

    let line = txt.line;
    if (!line) return;
    gCtx.fillText(line, txtX, txtY);
    gCtx.strokeText(line, txtX, txtY);
}

function onChangeTxt(txt) {
    changeTxt('line', txt);
    renderImg();
}

function onSelectImg(imgIdx) {
    document.querySelector('.txt-input').value = '';
    createMeme(imgIdx);
    renderImg();
}



