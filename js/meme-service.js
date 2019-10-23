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
        selectedTxtIdx: 0,
        txts: [{size: 70, align: 'center', color: 'white', height: 70}, {size: 70, align: 'center', color: 'white', height: 500}]
    }
}

function updateTxt(prop, val) {
    gMeme.txts[gMeme.selectedTxtIdx][prop] = val;
}

function getCurrImg() {
    return gImgs.find(img => {
        return img.id === gMeme.selectedImgId;
    });
}

function getTxts() {
    return gMeme.txts;
}

function getCurrTxt() {
    return gMeme.txts[gMeme.selectedTxtIdx];
}

function getCurrTxtIdx() {
    return gMeme.txts.indexOf(getCurrTxt());
}

function switchLine() {
    let currLine = gMeme.selectedTxtIdx;
    let newLine = (currLine === gMeme.txts.length - 1) ? 0 : currLine + 1;
    gMeme.selectedTxtIdx = newLine;
}

