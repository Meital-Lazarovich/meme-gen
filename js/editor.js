'use strict';

let gCanvas;
let gCtx;
let gImgWidth;
let gImgHeight;
let gIsHoldingLine = false;


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
    if (currTxt) {
        let currHeight = currTxt.height;
        let currSize = currTxt.size;
        gCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        gCtx.fillRect(0, currHeight - currSize / 2 - 10, gImgWidth, currSize + 10);
    }

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
    
    let txts = getTxts();
    let clickedLine = txts.find(txt => {
        return (
            y > txt.height - txt.size / 2 &&
            y < txt.height + txt.size / 2
        )
    })
    if (clickedLine) {
        gIsHoldingLine = true;
        onSwitchLine(clickedLine);
        document.querySelector('.canvas').classList.remove('hovering-line');
        document.querySelector('.canvas').classList.add('holding-line');
    } else onUnselectLine();
}

function onCanvasClickEnd(ev) {
    gIsHoldingLine = false;
    document.querySelector('.canvas').classList.remove('holding-line');
    onCurrLineChange();
}

function onCanvasClickMove(ev) {
    let y = ev.offsetY;
    if (ev.type === 'mousemove' && !gIsHoldingLine) {
        let txts = getTxts();
        if (!txts) return;
        let hoverdLine = txts.find(txt => {
            return (
                y > txt.height - txt.size / 2 &&
                y < txt.height + txt.size / 2
            )
        })
        if (hoverdLine) document.querySelector('.canvas').classList.add('hovering-line');
        else document.querySelector('.canvas').classList.remove('hovering-line');
    }
    else if (gIsHoldingLine) {
        updateTxt('height', y);
        renderImg();
    }
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

function onSwitchLine(clickedLine) {
    if (!clickedLine) switchLine();
    else pickLine(clickedLine);
    onCurrLineChange();
}

function onAddLine() {
    addLine(gImgHeight);
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

function onUnselectLine() {
    unselectLine();
    onCurrLineChange();
}


function onCurrLineChange() {
    let currTxt = getCurrTxt();
    let elTxtInput = document.querySelector('.line-input');
    if (currTxt) {
        elTxtInput.value = currTxt.line;
        elTxtInput.focus();
        document.querySelector('.select-font').value = currTxt.font;
        document.querySelector('#stroke-color').value = currTxt.strokeColor;
        document.querySelector('#txt-color').value = currTxt.txtColor;
    } else elTxtInput.value = '';
    renderImg();
}