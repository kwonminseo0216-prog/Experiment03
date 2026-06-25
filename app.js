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
    if (!AppState.apiKey) return alert("구글 AI 스튜디오에서 발급받은 Gemini API Key를 입력해야 분석을 시작할 수 있습니다.");

    showLoading(true);

    try {
        // 1단계: 지문 메인 분석 처리 (국어/영어 자동 판정 포함 프롬프트 생성)
        const payload = window.buildPrompt(AppState.textA, AppState.grade, AppState.isCompareMode ? AppState.textB : null);
        
        // 2단계: 구글 제미나이 API 호출
        const aiRawResponse = await requestToLLM(payload, AppState.apiKey);
        
        // 3단계: 결과 파싱 및 데이터 분배
        window.processAnalysisResult(aiRawResponse);
        
        // 자동 저장 기능 연동
        if(window.autoSaveData) window.autoSaveData();
        
    } catch (error) {
        console.error(error);
        alert("분석 도중 오류가 발생했습니다: " + error.message + "\nAPI 키가 올바른지, 혹은 인터넷 연결을 확인해 주세요.");
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    const overlay = document.getElementById("loadingOverlay");
    if(isLoading) overlay.classList.remove("hidden");
    else overlay.classList.add("hidden");
}

/**
 * 구글 Gemini 1.5 Flash 공식 무료 API 요청 함수
 */
async function requestToLLM(promptText, apiKey) {
    // 100% 무료이면서도 엄청나게 빠른 gemini-1.5-flash 모델 엔드포인트입니다.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ text: promptText }] 
            }],
            generationConfig: {
                // 인공지능이 헛소리를 하지 않고 100% 깔끔한 JSON 코드만 반환하도록 강제하는 옵션입니다.
                responseMimeType: "application/json"
            }
        })
    });

    if(!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP 에러 상태 코드: ${response.status}`);
    }
    
    const resData = await response.json();
    
    // 구글 제미나이의 응답 텍스트를 정밀 추출하여 반환합니다.
    return resData.candidates[0].content.parts[0].text;
}
