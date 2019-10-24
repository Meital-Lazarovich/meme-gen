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

        let imgRatio = imgHeight / imgWidth;
        let height;
        let width;

        if (imgRatio > 1) {
            //verticle img:
            imgRatio = imgWidth / imgHeight;
            height = 400;
            width = height * imgRatio;
        } else {
            //horizontal img:
            width = 400;
            height = width * imgRatio;
        }

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

    // heighlighting the current txt
    let currTxt = getCurrTxt();
    let currHeight = currTxt.height;
    let currSize = currTxt.size;
    gCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    gCtx.fillRect(0, currHeight - currSize / 2 - 10, gImgWidth, currSize + 10);

    let txts = getTxts();

    txts.forEach(txt => {
        gCtx.fillStyle = txt.txtColor;
        gCtx.strokeStyle = txt.strokeColor;
        gCtx.font = `bold ${txt.size}px ${txt.font}`;
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
        gCtx.textBaseline = "middle";

        let line = txt.line;
        if (!line) return;
        gCtx.fillText(line, txtX, txtY);
        gCtx.strokeText(line, txtX, txtY);
    })
}

function onCanvasClicked(ev) {
    let y;
    if (ev.type === 'touchstart') {
        ev.preventDefault();
        y = ev.touches[0].clientY;
    }
    else y = ev.offsetY;
    let canvasCoords = gCanvas.getBoundingClientRect();
    y -= (canvasCoords.y + window.scrollY);
    if (canvasCoords.top > 70) y += 9;
    console.log('y', y);
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
    updateTxt('height', height + addedHeight);
    renderImg();
}

function onSwitchLine() {
    switchLine();
    onCurrLineChange()
}

function onAddLine() {
    addLine();
    onCurrLineChange()
}

function onRemoveLine() {
    removeLine();
    onCurrLineChange()
}

function onChangeAlign(align) {
    updateTxt('align', align);
    renderImg();
}

function onChangeFont(font) {
    updateTxt('font', font);
    renderImg();
}

function onChangeColor(prop, color) {
    updateTxt(prop, color);
    renderImg();
}



function onCurrLineChange() {
    let currTxt = getCurrTxt();
    let elTxtInput = document.querySelector('.line-input');
    elTxtInput.value = currTxt.line;
    elTxtInput.focus();
    document.querySelector('.select-font').value = currTxt.font;
    document.querySelector('#stroke-color').value = currTxt.strokeColor;
    document.querySelector('#txt-color').value = currTxt.txtColor;
    renderImg();
}