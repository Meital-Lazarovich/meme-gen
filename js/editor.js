'use strict';

let gCanvas;
let gCtx;
let gImgWidth;
let gImgHeight;

function initCanvas() {
    createImgs();
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    renderImg();
    document.querySelector('.line-input').focus();
}

function renderImg() {
    let img = new Image();
    img.onload = function () {
        let imgHeight = img.height;
        let imgWidth = img.width;
        let resizeRatio = 400 / imgHeight;
        let height = imgHeight * resizeRatio;
        let width = imgWidth * resizeRatio;

        gCanvas.width = width;
        gCanvas.height = height;

        gImgWidth = width;
        gImgHeight = height;

        gCtx.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, width, height);

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
    let elTxtInput = document.querySelector('.line-input');
    elTxtInput.value = currLineTxt;
    elTxtInput.focus();
}
