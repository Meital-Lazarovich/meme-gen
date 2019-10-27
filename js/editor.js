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
        let windowWidth = window.innerWidth;

        
        if (imgRatio > 1) {
            //verticle img:
            height = 415;
            if (windowWidth < 860) height = 350;
            if (windowWidth < 705) height = 320;
            if (windowWidth < 680) height = 320;

            width = height * imgRatio;

        } else {
            //horizontal or square img:
            width = 415;
            if (windowWidth < 860) width = 350;
            if (windowWidth < 705) width = 320;
            if (windowWidth < 680) width = 320;

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
        let line = txt.line;
        while (line.length * txt.size / 2.2 > gImgWidth) {
            txt.size--;
        }
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
        let canvasCoords = gCanvas.getBoundingClientRect();
        y -= (canvasCoords.y + window.scrollY);
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

function onCanvasClickEnd() {
    gIsHoldingLine = false;
    document.querySelector('.canvas').classList.remove('holding-line');
    onCurrLineChange();
}

function onCanvasClickMove(ev) {
    ev.preventDefault();
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
        return;
    }
    if (ev.type === 'touchmove') {
        y = ev.touches[0].clientY;
        let canvasCoords = gCanvas.getBoundingClientRect();
        y -= (canvasCoords.y + window.scrollY);
    }
    if (gIsHoldingLine) {
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

function openShareModal() {
    onUnselectLine();
    toggleModal('.share-modal');
}

function closeShareModal() {
    toggleModal('.share-modal');
}

function onDownloadMeme(elLink) {
    let imgContent;
    if (window.location.pathname === '/saved.html') imgContent = gClickedMeme;
    else imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function onSaveMeme() {
    let memeContent = gCanvas.toDataURL('image/jpeg');
    saveUserMeme(memeContent);
    closeShareModal();
}

function onShareMeme(elForm, ev) {
    ev.preventDefault();
    let img;
    if (window.location.pathname === '/saved.html') img = gClickedMeme;
    else img = gCanvas.toDataURL('image/jpeg');
    document.querySelector('.imgData').value = img;
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           <button class="share-btn facebook-btn"><img src="img/icons/facebook.png"/></button>
        </a>`
    }
    doUploadMeme(elForm, onSuccess);
}

function doUploadMeme(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (response) {
        return response.text()
    })

    .then(onSuccess)
    .catch(function (error) {
        console.error(error)
    })
}

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));




