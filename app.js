// 글로벌 상태 관리 시스템
const AppState = {
    theme: 'light',
    grade: 'high1',
    apiKey: '',
    textA: '',
    textB: '',
    isCompareMode: false,
    analysisData: null,
    compareData: null,
    history: []
};

document.addEventListener("DOMContentLoaded", () => {
    initEventHandlers();
    // 타 모듈 초기화 신호 송신
    if(window.loadSettings) window.loadSettings();
    if(window.initHistory) window.initHistory();
    if(window.initTimer) window.initTimer();
});

function initEventHandlers() {
    // 다크모드 스위칭
    document.getElementById("themeToggleBtn").addEventListener("click", () => {
        AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', AppState.theme);
        if(window.saveThemeSetting) window.saveThemeSetting(AppState.theme);
    });

    // 탭 메뉴 전환 기능
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            e.target.classList.add("active");
            const tabId = e.target.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
            
            // Mermaid 렌더링 동기화 처리
            if(tabId === 'tab-visual' && window.renderMermaidCharts) {
                window.renderMermaidCharts();
            }
        });
    });

    // 비교 모드 토글
    document.getElementById("toggleCompareBtn").addEventListener("click", (e) => {
        AppState.isCompareMode = !AppState.isCompareMode;
        const bContainer = document.getElementById("compareInputContainer");
        const compareTab = document.getElementById("compareTabBtn");
        if(AppState.isCompareMode) {
            bContainer.style.display = "block";
            compareTab.style.display = "inline-block";
            e.target.textContent = "🔄 단일 지문 모드로 전환";
            e.target.style.background = "var(--secondary-color)";
        } else {
            bContainer.style.display = "none";
            compareTab.style.display = "none";
            e.target.textContent = "🔄 지문 비교 모드 켜기";
            e.target.style.background = "";
        }
    });

    // 메인 분석 실행 단추
    document.getElementById("analyzeBtn").addEventListener("click", runMainAnalysis);
}

async function runMainAnalysis() {
    AppState.textA = document.getElementById("inputText").value.trim();
    AppState.textB = document.getElementById("inputTextB").value.trim();
    AppState.apiKey = document.getElementById("apiKeyInput").value.trim();
    AppState.grade = document.getElementById("gradeSelect").value;

    if (!AppState.textA) return alert("분석할 지문을 입력해 주세요.");
    if (!AppState.apiKey) return alert("API Key를 입력해야 AI 분석을 시작할 수 있습니다.");

    showLoading(true);

    try {
        // 1단계: 지문 메인 분석 처리 (국어/영어 자동 판정 포함)
        const payload = window.buildPrompt(AppState.textA, AppState.grade, AppState.isCompareMode ? AppState.textB : null);
        const aiRawResponse = await requestToLLM(payload, AppState.apiKey);
        
        // 2단계: 결과 파싱 및 데이터 분배
        window.processAnalysisResult(aiRawResponse);
        
        // 자동 저장 기능 연동
        if(window.autoSaveData) window.autoSaveData();
        
    } catch (error) {
        console.error(error);
        alert("분석 도중 오류가 발생했습니다: " + error.message);
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    const overlay = document.getElementById("loadingOverlay");
    if(isLoading) overlay.classList.remove("hidden");
    else overlay.classList.add("hidden");
}

// 범용 타사 LLM API 요청 구조체 표준화 함수
async function requestToLLM(promptText, apiKey) {
    // Anthropic Claude 또는 기타 호환 API 포맷 기준 예제 작성 (OpenAI 규격 제외)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "dangerously-allow-the-api-key-in-the-browser": "true"
        },
        body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            messages: [{ role: "user", content: promptText }]
        })
    });

    if(!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }
    const resData = await response.json();
    return resData.content[0].text;
}

