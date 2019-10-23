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
        renderImgTxts();
    }
    img.src = getCurrImg().url;
}

function renderImgTxts() {
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 3;

    let txts = getTxts();

    txts.forEach(txt => {
        gCtx.fillStyle = txt.color;
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
    
        let txtY = txt.height;
    
        let line = txt.line;
        if (!line) return;
        gCtx.fillText(line, txtX, txtY);
        gCtx.strokeText(line, txtX, txtY);
    })
}

function onChangeTxt(txt) {
    updateTxt('line', txt);
    renderImg();
}

function onSelectImg(imgIdx) {
    let elTxtInput = document.querySelector('.txt-input');
    elTxtInput.value = '';
    elTxtInput.focus();
    createMeme(imgIdx);
    renderImg();
}

function onChangeFontSize(addedSize) {
    let size = getCurrTxt().size;
    size += addedSize;
    if (size < 30 || size > 120) return; 
    updateTxt('size', size);
    renderImg();
}

function onChangeLineHeight(addedHeight) {
    let height = getCurrTxt().height;
    height += addedHeight;
    updateTxt('height', height);
    renderImg();
}

function onSwitchLine() {
    switchLine();
    let currLineTxt = getCurrTxt().line;
    if (!currLineTxt) currLineTxt = '';
    let elTxtInput = document.querySelector('.txt-input');
    elTxtInput.value = currLineTxt;
    elTxtInput.focus();
}
