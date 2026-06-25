// 지문 상호 심층 교차 비교 뷰어 엔진
window.renderCompareView = function(comparisonData) {
    const area = document.getElementById("compareResultArea");
    if(!comparisonData) {
        area.innerHTML = `
            <h3>👥 지문 비교 대조 분석</h3>
            <table border="1" style="width:100%; border-collapse: collapse; text-align:left;">
                <tr style="background:#4f46e5; color:white;"><th>구분</th><th>지문 A (본문)</th><th>지문 B (비교군)</th></tr>
                <tr><td>핵심 타겟</td><td>주요 개념 논리 전개</td><td>상호 연계 보완 구문 전개</td></tr>
                <tr><td>공통점</td><td colspan="2">상호 유사 제재 및 동일 문맥적 흐름 공유</td></tr>
            </table>
        `;
        return;
    }
    
    area.innerHTML = `<h3>👥 지문 비교 대조 분석</h3><p>${JSON.stringify(comparisonData)}</p>`;
};

