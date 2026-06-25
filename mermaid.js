// Mermaid.js를 이용한 데이터 구조 시각화 연동
window.setupMermaidChart = function(mermaidCode) {
    const container = document.getElementById("mermaidContainer");
    container.removeAttribute("data-processed");
    
    // 유효성 기본 래퍼 방어 코드
    if(!mermaidCode || !mermaidCode.includes("graph")) {
        container.innerHTML = "graph TD\n    A[본문] --> B[분석 지연]";
    } else {
        container.innerHTML = mermaidCode;
    }
};

window.renderMermaidCharts = function() {
    try {
        if(window.mermaid) {
            mermaid.initialize({ startOnLoad: false, theme: AppState.theme === 'dark' ? 'dark' : 'default' });
            mermaid.init(undefined, document.getElementById("mermaidContainer"));
        }
    } catch(e) {
        console.error("Mermaid 렌더 연산 지연: ", e);
    }
};
