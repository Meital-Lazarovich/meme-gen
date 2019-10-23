'use strict';

let gNextId = 101;

let gImgs;
// var gKeywords = {'happy': 12,'funny puk': 1} - OBJUCT MAP
let gKeywords;
let gMeme;

createImgs();

function createImgs() {
    gImgs = [];
    for (let i = 0; i < 25; i++) {
        gImgs.push(createImg(gNextId, `img/memes/${i}.jpg`, ['popular'])) 
        gNextId++;
    }
}

function createImg(id, url, keywords) {
    return {
        id,
        url,
        keywords
    }
}

function createMeme(selectedImgId) {
    gMeme = {
        selectedImgId,
        selectedTxtIdx: 1,
        txts: [{size: 70, align: 'center', color: 'white', height: 0}, {size: 70, align: 'center', color: 'white', height: 0}, {size: 70, align: 'center', color: 'white', height: 0}]
    }
}

function updateTxt(prop, val) {
    gMeme.txts[gMeme.selectedTxtIdx][prop] = val;
}

function getCurrImg() {
    return gImgs.find(img => {
        return img.id === gMeme.selectedImgId
    });
}

function getCurrTxt() {
    return gMeme.txts[gMeme.selectedTxtIdx];
}

function getCurrTxtIdx() {
    return gMeme.txts.indexOf(getCurrTxt());
}

