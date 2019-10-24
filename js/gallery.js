'use strict';

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
