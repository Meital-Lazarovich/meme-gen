'use strict';

const MEME_KEY = 'meme';

let gNextId = 101;
let gImgs;
// var gKeywords = {'happy': 12,'funny puk': 1} - OBJUCT MAP
let gKeywords;
let gMeme;


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
        txts: [createTxt(50)]
    }
    saveMeme();
}

function createTxt(height) {
    return {size: 60, align: 'center', txtColor: 'white', strokeColor: 'black', height, line: '', font: 'Impact'}
}

function updateTxt(prop, val) {
    gMeme.txts[gMeme.selectedTxtIdx][prop] = val;
    saveMeme();
}

function getCurrImg() {
    gMeme = loadMeme();
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
    let currTxtIdx = gMeme.selectedTxtIdx;
    let newCurrTxtIdx = (currTxtIdx === gMeme.txts.length - 1) ? 0 : currTxtIdx + 1;
    gMeme.selectedTxtIdx = newCurrTxtIdx;
    saveMeme();
}

function addLine() {
    let height = 200;
    if (gMeme.txts.length === 1) height = 350;
    gMeme.txts.push(createTxt(height));
    gMeme.selectedTxtIdx = gMeme.txts.length - 1;
    saveMeme();
}

function removeLine() {
    let currTxtIdx = getCurrTxtIdx();
    if (gMeme.txts.length === 1) {
        let imgId = gMeme.selectedImgId;
        createMeme(imgId);
        return
    }
    gMeme.txts.splice(currTxtIdx, 1);
    gMeme.selectedTxtIdx = gMeme.txts.length - 1;
    switchLine();
}


// saving and loading from local storage

function saveMeme() {
    saveToStorage(MEME_KEY, gMeme);
}

function loadMeme() {
    return loadFromStorage(MEME_KEY);
}


