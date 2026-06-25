// 로컬 스토리지를 경유하는 실시간 클라이언트 영속성 컨트롤러
window.saveThemeSetting = function(theme) {
    localStorage.setItem("app_theme", theme);
};

window.autoSaveData = function() {
    if(AppState.textA) localStorage.setItem("last_text_a", AppState.textA);
    if(AppState.textB) localStorage.setItem("last_text_b", AppState.textB);
    if(AppState.analysisData) localStorage.setItem("last_analysis_json", JSON.stringify(AppState.analysisData));
};

window.loadSettings = function() {
    // 테마 설정 복원
    const savedTheme = localStorage.getItem("app_theme") || "light";
    AppState.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 마지막 텍스트 유저 편의 입력 상태값 복구
    const lastA = localStorage.getItem("last_text_a");
    if(lastA) document.getElementById("inputText").value = lastA;
    
    const apiKey = localStorage.getItem("app_apikey");
    if(apiKey) document.getElementById("apiKeyInput").value = apiKey;
};

// API Key 세션 가드 보존 처리
document.getElementById("apiKeyInput").addEventListener("change", (e) => {
    localStorage.setItem("app_apikey", e.target.value.trim());
});

