const { ipcRenderer } = require('electron');

let wordText = null;
async function loadWordOfTheDay() {
    const loader = document.getElementById('loader');
    const wordEl = document.querySelector('.word');
    const columnEl = document.querySelector('.column');
    const meaningEl = document.querySelector('.meaning');
  
    // Clear old content & show loader
    wordEl.innerText = '';
    meaningEl.innerText = '';
    columnEl.style.display = 'none';
    loader.style.display = 'block';
  
    try {
      const word = await ipcRenderer.invoke('fetch-polish-word');
  
      wordEl.innerText = word.polish;
      meaningEl.innerText = word.english;
      wordText = word.polish;
    } catch (error) {
      console.error('Failed to load word:', error);
      wordEl.innerText = 'Error';
      meaningEl.innerText = 'Could not fetch word';
    } finally {
      columnEl.style.display = 'flex';
      loader.style.display = 'none'; // hide loader
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    
    loadWordOfTheDay();
    document.querySelector('.play').addEventListener('click', () => {
        speakPolish(wordText);
      });
  });

  function speakPolish(text) {
    if (!text) return;
    // window.speechSynthesis.cancel(); // cancel any ongoing speech
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.lang = 'pl-PL';
    // utterance.rate = 0.30;
    // window.speechSynthesis.speak(utterance);
    responsiveVoice.speak(text, "Polish Female", {rate: 0.8});
  }
  
  module.exports = { speakPolish };
  