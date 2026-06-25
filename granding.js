// 자동 시험 채점 및 마크업 활성화 스크립트
document.getElementById("gradeBtn").addEventListener("click", () => {
    if(!window.currentQuizData) return;
    
    let totalScore = 0;
    let earnedScore = 0;

    // 객관식 대조 검증 루틴
    const mcItems = document.querySelectorAll(".quiz-item[data-type='mc']");
    mcItems.forEach(item => {
        totalScore += 20;
        const idx = item.getAttribute("data-idx");
        const selected = document.querySelector(`input[name="mc_${idx}"]:checked`);
        const solDiv = document.getElementById(`sol_mc_${idx}`);
        solDiv.classList.remove("hidden");
        
        if(selected && parseInt(selected.value) === window.currentQuizData.multipleChoice[idx].a) {
            earnedScore += 20;
            item.style.borderLeft = "5px solid var(--secondary-color)";
        } else {
            item.style.borderLeft = "5px solid var(--accent-color)";
        }
    });

    // OX 대조 검증 루틴
    const oxItems = document.querySelectorAll(".quiz-item[data-type='ox']");
    oxItems.forEach(item => {
        totalScore += 10;
        const idx = item.getAttribute("data-idx");
        const selected = document.querySelector(`input[name="ox_${idx}"]:checked`);
        const solDiv = document.getElementById(`sol_ox_${idx}`);
        solDiv.classList.remove("hidden");

        if(selected && selected.value === window.currentQuizData.ox[idx].a) {
            earnedScore += 10;
            item.style.borderLeft = "5px solid var(--secondary-color)";
        } else {
            item.style.borderLeft = "5px solid var(--accent-color)";
        }
    });

    // 주관식 단순 예시 컴포넌트 해제 노출
    document.querySelectorAll(".quiz-item[data-type='subj'] .solution").forEach(s => s.classList.remove("hidden"));

    // 결과 디스플레이 서포트
    const resultBox = document.getElementById("gradingResult");
    resultBox.innerHTML = `<h3>📊 채점 결과 피드백</h3><p>총점: ${totalScore}점 중 <strong>${earnedScore}점</strong> 획득!</p>`;
    
    // 통계 시스템 누적 동기화
    if(window.addGlobalStats) window.addGlobalStats(earnedScore);
});

