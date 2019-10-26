'use strict';

let gClickedMeme;

function initGallery() {
    createImgs();
    renderGallery();
}

function onSelectImg(imgIdx) {
    createMeme(imgIdx);
    window.location = 'editor.html';
    initCanvas();
}

function renderGallery() {
    let imgs = getImgs();
    let strHTMLs = imgs.map(img => {
        return `<div onclick="onSelectImg(${img.id})"><img src="${img.url}"/></div>`;
    });
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('');
}

function renderSavedMemes() {
    let memes = getUserMemes();
    console.log('memes', memes);
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

