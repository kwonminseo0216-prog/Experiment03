// 포모도로 타이머 로직 관리 엔진
let timerInterval = null;
let timeRemaining = 25 * 60;

window.initTimer = function() {
    const display = document.getElementById("timerDisplay");
    
    document.getElementById("startTimerBtn").addEventListener("click", () => {
        if(timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById("startTimerBtn").textContent = "시작";
        } else {
            document.getElementById("startTimerBtn").textContent = "정지";
            timerInterval = setInterval(() => {
                if(timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert("⏰ 포모도로 학습 시간이 완료되었습니다! 휴식을 취하세요.");
                    timeRemaining = 25 * 60;
                } else {
                    timeRemaining--;
                    const mins = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
                    const secs = (timeRemaining % 60).toString().padStart(2, '0');
                    display.textContent = `${mins}:${secs}`;
                }
            }, 1000);
        }
    });

    document.getElementById("resetTimerBtn").addEventListener("click", () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timeRemaining = 25 * 60;
        display.textContent = "25:00";
        document.getElementById("startTimerBtn").textContent = "시작";
    });
};
