// Web Speech API 활용 오디오 제어 드라이버
let currentSpeechUtterance = null;

document.getElementById("ttsPlayBtn").addEventListener("click", () => {
    const text = document.getElementById("inputText").value;
    if(!text) return;

    window.speechSynthesis.cancel(); // 이전 큐 전체 삭제

    currentSpeechUtterance = new SpeechSynthesisUtterance(text);
    const isEnglish = /[a-zA-Z]{10,}/.test(text);
    currentSpeechUtterance.lang = isEnglish ? 'en-US' : 'ko-KR';
    
    // 유저 정의 변조 스피드 반영
    const speedInput = document.getElementById("ttsSpeed").value;
    currentSpeechUtterance.rate = parseFloat(speedInput);

    window.speechSynthesis.speak(currentSpeechUtterance);
});

document.getElementById("ttsPauseBtn").addEventListener("click", () => {
    if(window.speechSynthesis.speaking) {
        if(window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        } else {
            window.speechSynthesis.pause();
        }
    }
});

