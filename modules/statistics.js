// 학습량 관리 누적 처리 통계기
let globalTotalAnalyses = 0;
let globalScoresArray = [];

window.addGlobalStats = function(score) {
    globalTotalAnalyses++;
    globalScoresArray.push(score);
    
    const sum = globalScoresArray.reduce((a, b) => a + b, 0);
    const avg = (sum / globalScoresArray.length).toFixed(1);

    document.getElementById("statsArea").innerHTML = `
        누적 분석량: ${globalTotalAnalyses}회 <br>
        모의 테스트 평균 점수: <strong>${avg}점</strong>
    `;
};
