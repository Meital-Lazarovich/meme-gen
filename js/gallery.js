'use strict';

let gClickedMeme;

function initGallery() {
    createImgs();
    renderGallery();
}

function onSelectImg(imgIdx) {
    createMeme(imgIdx);
    window.location = 'editor.html';
}

function renderGallery() {
    let imgs = getImgs();
    let strHTMLs = imgs.map(img => {
        return `<div onclick="onSelectImg(${img.id})"><img src="${img.url}"/></div>`;
    });
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('');
    renderKeywords();
}

function renderKeywords() {
    let keywords = getKeywords();
    let strHTML = '';
    for (var key in keywords) {
        strHTML += `<span style="font-size: ${keywords[key] * 2 + 10}px;"
        onclick="onKeywordFilter(this)">${key}</span>`;
    }
    document.querySelector('.keywords-container').innerHTML = strHTML;
}

function onToggleMoreKeywords(elMoreBtn) {
    document.querySelector('.keywords-container').classList.toggle('opened');
    let txt = (elMoreBtn.innerText === 'more...') ? 'less' : 'more...';
    elMoreBtn.innerText = txt;
}

function onKeywordFilter(elKeyword) {
    filterImgs(elKeyword.innerText);
    renderGallery();
}

function onSearchKeyword(val) {
    filterImgs(val);
    renderGallery();
}

function renderSavedMemes() {
    let memes = getUserMemes();
    if (!memes) return;
    let strHTMLs = memes.map((meme, idx) => {
        return `<img src=${meme} data-idx=${idx} onclick="openSavedModal(this)"/>`
    });
    document.querySelector('.saved-container').innerHTML = strHTMLs.join('');
}

function openSavedModal(el) {
    gClickedMeme = getCurrUserMeme(el.dataset.idx);
    document.querySelector('.meme-container').innerHTML = `<img src="${gClickedMeme}"/>`;
    toggleModal('.saved-modal');
}

function closeSavedModal() {
    toggleModal('.saved-modal');
}

function toggleModal(modalClass) {
    document.querySelector(modalClass).classList.toggle('closed');
    document.querySelector('body').classList.toggle('opened-modal');
}

function toggleMenu() {
    document.querySelector('body').classList.toggle('open-menu');
}

function renderHiddenCanvas(img) {
    let elHiddenCanvas = document.querySelector('.hidden-canvas');
    let ctx = elHiddenCanvas.getContext('2d');
    elHiddenCanvas.width = img.width;
    elHiddenCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    let uploadedImg = elHiddenCanvas.toDataURL('image/jpeg');
    saveUploadedImg(uploadedImg);
    onSelectImg('uploaded');
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderHiddenCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

