// 핵심 문장 구문 강조 및 매핑 오버레이어
window.renderHighlighter = function(importantSentences) {
    const zone = document.getElementById("highlightedContent");
    let originText = AppState.textA;
    
    zone.innerHTML = "<h3>✒️ 주요 문장 형광펜 강조 요약</h3>";

    if(!importantSentences) return;

    importantSentences.forEach(sentence => {
        // 본문 가공 처리 기법
        const regex = new RegExp(sentence.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        originText = originText.replace(regex, `<mark title="사유: ${sentence.reason}">${sentence.text}</mark>`);
    });

    const p = document.createElement("p");
    p.className = "wrapped-text";
    p.innerHTML = originText;
    zone.appendChild(p);
};

