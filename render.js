const { ipcRenderer } = require('electron');

let wordText = null;
let sentenceP = null;
let sentenceE = null;
async function loadWordOfTheDay() {
    const loader = document.getElementById('loader');
    const wordEl = document.querySelector('.word');
    const columnEl = document.querySelector('.column');
    const play = document.querySelector('#play-sentence');
    const meaningEl = document.querySelector('.meaning');
    const examplePol = document.getElementById('polish');
    const exampleEng = document.getElementById('english');
  
    // Clear old content & show loader
    wordEl.innerText = '';
    meaningEl.innerText = '';
    examplePol.innerText = '';
    exampleEng.innerText = '';
    columnEl.style.display = 'none';
    play.style.display = 'none';
    loader.style.display = 'block';
  
    try {
      const word = await ipcRenderer.invoke('fetch-polish-word');
  
      wordEl.innerText = word.polish;
      meaningEl.innerText = word.english;
      examplePol.innerText = word.sentencePol;
      exampleEng.innerText = word.sentenceEng;
      wordText = word.polish;
      sentenceP = word.sentencePol;
      sentenceE = word.sentenceEng;
    } catch (error) {
      console.error('Failed to load word:', error);
      wordEl.innerText = 'Error';
      meaningEl.innerText = 'Could not fetch word';
      examplePol.innerText = '';
      exampleEng.innerText = '';
    } finally {
      columnEl.style.display = 'flex';
      play.style.display = 'flex';
      loader.style.display = 'none'; // hide loader
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    
    loadWordOfTheDay();
    document.querySelector('#play-word').addEventListener('click', () => {
        speakPolish(wordText,'#play-word');
      });
    document.querySelector('#play-sentence').addEventListener('click', () => {
        speakPolish(sentenceP,'#play-sentence');
    });
  });

  function speakPolish(text, buttonId = null) {
    if (!text) return;
  
    const playBtn = buttonId ? document.querySelector(buttonId) : null;
    const icon = playBtn ? playBtn.querySelector('.play-icon') : null;
    const originalSrc = icon?.getAttribute('src');
  
    if (icon) icon.setAttribute('src', 'sound-icon.svg');
  
    responsiveVoice.speak(text, "Polish Female", {
      rate: 0.6,
      onend: () => {
        if (icon) icon.setAttribute('src', originalSrc);
      }
    });
  
    // fallback in case onend fails (e.g., fast click)
    setTimeout(() => {
      if (icon) icon.setAttribute('src', originalSrc);
    }, 5000); // adjust to match average duration
  }
  
  
  module.exports = { speakPolish };
  