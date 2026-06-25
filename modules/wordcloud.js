// 단순 DOM 트리 컴포지션 기반 워드클라우드 시뮬레이터
window.renderWordCloud = function(keywords) {
    const container = document.getElementById("wordcloudContainer");
    container.innerHTML = "";

    if(!keywords) return;

    keywords.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item.word;
        // 가중치 비례 폰트 사이즈 스케일링 가공
        const calculatedSize = Math.max(12, Math.min(36, item.weight / 2));
        span.style.fontSize = `${calculatedSize}px`;
        span.style.margin = "5px";
        span.style.cursor = "pointer";
        span.style.fontWeight = "bold";
        span.style.color = getRandomColor();
        
        span.addEventListener("click", () => {
            alert(`💡 [${item.word}] 의미 설명:\n${item.desc}`);
        });

        container.appendChild(span);
    });
};

function getRandomColor() {
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

