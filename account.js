// 커스텀 사용자 설정 인터페이스 가드 변형 레이어
document.getElementById("fontSizeRange").addEventListener("input", (e) => {
    const val = e.target.value;
    document.getElementById("analysisResult").style.fontSize = `${val}px`;
    document.getElementById("highlightedContent").style.fontSize = `${val}px`;
});

