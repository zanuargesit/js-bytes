document.addEventListener('DOMContentLoaded', function() {
    const textToType = document.getElementById('text-to-type');
    const userInput = document.getElementById('user-input');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button'); 
    const timerDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('words-per-minute');
    const resultsDiv = document.getElementById('results');
    
    let startTime;
    let timerInterval;
    let isTyping = false;
    let originalText = textToType.textContent.trim();
    
    function init() {
        startButton.addEventListener('click', startTest);
        resetButton.addEventListener('click', resetTest); 
        userInput.addEventListener('input', checkTyping);
        
        formatText();
        
        resetButton.disabled = true;
    }
    
    function formatText() {
        textToType.innerHTML = '';
        originalText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToType.appendChild(span);
        });
    }
    
    function startTest() {
        if (isTyping) return;
        
        isTyping = true;
        startButton.disabled = true;
        resetButton.disabled = false; 
        userInput.value = '';
        userInput.focus();
        startTime = new Date();
        resultsDiv.style.display = 'none';
        
        document.querySelectorAll('#text-to-type span').forEach(span => {
            span.className = '';
        });
        
        document.querySelector('#text-to-type span').classList.add('current');
        
        timerInterval = setInterval(updateTimer, 100);
    }
    
    function resetTest() {
        isTyping = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        resetButton.disabled = true; 
        userInput.value = '';
        timerDisplay.textContent = '0 seconds';
        wpmDisplay.textContent = '0';
        formatText();
        resultsDiv.style.display = 'none';
    }
    
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = (currentTime - startTime) / 1000;
        timerDisplay.textContent = `${elapsedTime.toFixed(1)} seconds`;
    }
    
    function checkTyping() {
        if (!isTyping) return;
        
        const inputText = userInput.value;
        const textSpans = document.querySelectorAll('#text-to-type span');
        
        let correctChars = 0;
        let currentPosition = inputText.length;
        
        textSpans.forEach((span, index) => {
            span.classList.remove('current');
            
            if (index < inputText.length) {
                if (span.textContent === inputText[index]) {
                    span.className = 'correct';
                    correctChars++;
                } else {
                    span.className = 'incorrect';
                }
            }
            
            if (index === inputText.length) {
                span.classList.add('current');
            }
        });
        
        if (inputText.length === originalText.length) {
            finishTest();
        }
    }
    
    function finishTest() {
        isTyping = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        resetButton.disabled = false;
        
        const endTime = new Date();
        const elapsedTime = (endTime - startTime) / 1000 / 60; 
        const words = originalText.split(' ').length;
        const wpm = Math.round(words / elapsedTime);
        
        wpmDisplay.textContent = wpm;
        resultsDiv.style.display = 'block';
    }
    
    init();
});