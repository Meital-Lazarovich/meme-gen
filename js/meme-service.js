'use strict';

const MEME_KEY = 'meme';
const USER_MEMES_KEY = 'userMemes';
const KEYWORDS_KEY = 'keywords';

let gNextId = 101;
let gImgs;
let gKeywords;
let gMeme;
let gUserMemes;
let gFilter;


function createImgs() {
    gImgs = [];
    for (let i = 0; i < 25; i++) {
        gImgs.push(createImg(gNextId, `img/memes/${i}.jpg`, ['popular', 'all'])) 
        gNextId++;
    }
    createKeywords();
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
    return {size: 60, align: 'center', txtColor: '#ffffff', strokeColor: '#000000', height, line: '', font: 'Impact'}
}

function updateTxt(prop, val) {
    if (!gMeme.txts[gMeme.selectedTxtIdx]) return;
    gMeme.txts[gMeme.selectedTxtIdx][prop] = val;
    saveMeme();
}

function getKeywords() {
    gKeywords = loadKeywords();
    return gKeywords;
}

function getCurrImg() {
    gMeme = loadMeme();
    return gImgs.find(img => {
        return img.id === gMeme.selectedImgId;
    });
}

function getTxts() {
    if (!gMeme) return;
    return gMeme.txts;
}

function getCurrTxt() {
    return gMeme.txts[gMeme.selectedTxtIdx];
}

function getCurrTxtIdx() {
    return gMeme.txts.indexOf(getCurrTxt());
}

function getImgs() {
    if (!gFilter) return gImgs;
    let imgsToShow = gImgs.filter(img => {
        return img.keywords.includes(gFilter);
    })
    return imgsToShow;
}

function switchLine() {
    let currTxtIdx = gMeme.selectedTxtIdx;
    let newCurrTxtIdx = (currTxtIdx === gMeme.txts.length - 1) ? 0 : currTxtIdx + 1;
    gMeme.selectedTxtIdx = newCurrTxtIdx;
    saveMeme();
}

function pickLine(line) {
    let newCurrTxtIdx = gMeme.txts.findIndex(txt => {
        return txt === line;
    });
    gMeme.selectedTxtIdx = newCurrTxtIdx;
    saveMeme();
}

function unselectLine() {
    gMeme.selectedTxtIdx = null;
    saveMeme();
}

function addLine(imgHeight) {
    let height = imgHeight / 2;
    if (gMeme.txts.length === 1) height = imgHeight - 50;
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

function saveUserMeme(img) {
    let memes = getUserMemes();
    gUserMemes = (memes) ? memes : [];
    gUserMemes.unshift(img);
    saveUserMemes();
}

function getUserMemes() {
    return loadUserMemes();
}

function getCurrUserMeme(memeIdx) {
    gUserMemes = loadUserMemes();
    return gUserMemes[memeIdx];
}

function filterImgs(keyword) {
    gFilter = keyword;
    gKeywords = loadKeywords();
    if (!gKeywords[keyword]) return;
    if (gKeywords[keyword] < 35) gKeywords[keyword]++;
    saveKeywords();
}


// saving and loading from local storage

function saveMeme() {
    saveToStorage(MEME_KEY, gMeme);
}

function loadMeme() {
    return loadFromStorage(MEME_KEY);
}

function saveUserMemes() {
    saveToStorage(USER_MEMES_KEY, gUserMemes)
}

function loadUserMemes() {
    return loadFromStorage(USER_MEMES_KEY);
}

function saveKeywords() {
    saveToStorage(KEYWORDS_KEY, gKeywords);
}

function loadKeywords() {
    return loadFromStorage(KEYWORDS_KEY);
}



function createKeywords() {
    let happyMemesIdxs = [0, 2, 11, 16, 21, 22];
    happyMemesIdxs.forEach(idx => gImgs[idx].keywords.push('happy'));
    let funnyMemesIdxs = [1, 4, 8, 9, 10, 11, 13, 14, 17, 19, 24];
    funnyMemesIdxs.forEach(idx => gImgs[idx].keywords.push('funny'));
    let animalsMemesIdxs = [5, 7, 15];
    animalsMemesIdxs.forEach(idx => gImgs[idx].keywords.push('animals'));
    let kidsMemesIdxs = [1, 6, 9, 11, 14];
    kidsMemesIdxs.forEach(idx => gImgs[idx].keywords.push('kids'));
    let womenMemesIdxs = [0, 21];
    womenMemesIdxs.forEach(idx => gImgs[idx].keywords.push('women'));
    let menMemesIdxs = [2, 3, 4, 8, 10, 12, 13, 16, 17, 18, 19, 20, 22, 23];
    menMemesIdxs.forEach(idx => gImgs[idx].keywords.push('men'));
    let cuteMemesIdxs = [1, 5, 6, 7];
    cuteMemesIdxs.forEach(idx => gImgs[idx].keywords.push('cute'));
    let trumpMemesIdxs = [3, 13];
    trumpMemesIdxs.forEach(idx => gImgs[idx].keywords.push('trump'));
    let evilMemesIdxs = [3, 9, 10, 13, 23];
    evilMemesIdxs.forEach(idx => gImgs[idx].keywords.push('evil'));
    let dogsMemesIdxs = [5, 6, 15];
    dogsMemesIdxs.forEach(idx => gImgs[idx].keywords.push('dogs'));

    let keywords = loadKeywords();
    if (keywords) {
        gKeywords = keywords;
        return;
    }
    gKeywords = {
        'all': 5,
        'popular': 12,
        'dogs': 5,
        'funny': 10,
        'trump': 1,
        'kids': 6,
        'animals': 9,
        'women': 1,
        'men': 1
    };
    saveKeywords();
}
