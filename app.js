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
    
    // API 안 쓰는 모드이므로 화면의 API Key 입력창에 안내 문구를 띄워줍니다.
    const apiKeyInput = document.getElementById("apiKeyInput");
    if(apiKeyInput) {
        apiKeyInput.value = "무료 모드 가동 중 (입력 불필요)";
        apiKeyInput.disabled = true;
        apiKeyInput.style.background = "#e5e7eb";
    }
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
    AppState.grade = document.getElementById("gradeSelect").value;

    if (!AppState.textA) return alert("분석할 지문을 입력해 주세요.");

    showLoading(true);

    try {
        // 서버나 외부 API 요청 없이 내부 가짜 데이터 함수를 바로 호출합니다.
        const aiRawResponse = await requestToLLM(AppState.textA, null);
        
        // 결과 파싱 및 데이터 분배
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

/**
 * API 호출 없이 내부에서 즉시 정답 양식을 생성하는 모의 함수
 */
async function requestToLLM(promptText, apiKey) {
    // 분석 중인 느낌을 주기 위해 0.4초 동안 아주 잠깐 딜레이를 줍니다.
    await new Promise(resolve => setTimeout(resolve, 400)); 

    // 어떤 지문을 넣든 즉시 완벽한 형태로 분석 결과 템플릿을 반환합니다.
    return JSON.stringify({
      "summary": "1. 입력된 지문은 인공지능(AI)의 발전과 현대 교육 패러다임의 변화를 논리적으로 설명하고 있습니다.\n2. 개별 맞춤형 교육 콘텐츠를 제공하여 학습 효율성을 극대화한다는 강력한 장점이 존재합니다.\n3. 다만 디지털 소외 계층의 정보 격차 문제와 인간 교사만이 줄 수 있는 정서적 유대의 중요성도 함께 강조됩니다.",
      "mainIdea": "인공지능 교육 도입에 따른 미래지향적 기대 효과와 해결해야 할 불평등 과제",
      "coreMessage": "급격한 기술 발전 속에서도 인간 중심의 교육적 가치와 균형 잡힌 시각을 잃지 말아야 한다.",
      "keywords": [
        {"word": "인공지능(AI)", "weight": 95, "desc": "인간의 지각 및 추론 능력을 컴퓨터 시스템으로 구현한 기술"},
        {"word": "맞춤형 교육", "weight": 88, "desc": "학생 개인의 학습 속도와 이해도에 맞추어 처방되는 개별화 학습"},
        {"word": "디지털 격차", "weight": 75, "desc": "IT 기술과 기기 접근성 차이로 인해 발생하는 정보 및 교육의 불평등"},
        {"word": "교사의 역할", "weight": 70, "desc": "단순 지식 전달자에서 학생의 성장을 돕는 학습 촉진자 및 멘토로의 변화"}
      ],
      "structure": "원인: AI 핵심 기술의 급격한 도약과 교육 현장 유입\n과정: 데이터 기반 개인 맞춤형 콘텐츠 활성화 및 학생별 약점 추적\n결과: 지식 격차 해소의 기회가 열림과 동시에, 인프라 미비에 따른 디지털 소외 문제 해결 과제 대두",
      "mermaid": "graph TD\n    A[AI 핵심 기술 발전] --> B[개인 맞춤형 교육 실현]\n    A --> C[디지털 인프라 격차 우려]\n    B --> D[자기주도적 학습 극대화]\n    C --> E[사회적 지원 및 정책 필요]",
      "questions": {
         "multipleChoice": [
           {"q": "위 지문의 전체 내용을 바탕으로 추론한 중심 내용으로 가장 적절한 것은?", "o": ["AI 교사의 전면 도입을 통한 전통 학교의 폐지 필요성", "인공지능 기반 맞춤형 교육 도입의 의의와 극복해야 할 과제", "디지털 격차가 발생하는 기술적 메커니즘의 분석", "정보기술 발전이 학생들의 정서에 미치는 부정적 영향", "글로벌 에듀테크 기업들의 시장 점유율 경쟁"], "a": 2, "e": "지문은 AI 교육이 가진 맞춤형 학습이라는 강력한 장점과, 동시에 해결해야 할 디지털 격차라는 과제를 균형 있게 다루고 있으므로 2번이 가장 적절합니다."}
         ],
         "ox": [
           {"q": "인공지능은 학생 개개인의 속도에 맞춘 맞춤형 교육을 제공하는 데 기여할 수 있다.", "a": "O", "e": "지문에서 AI가 개별 맞춤형 콘텐츠를 활성화하여 효율을 극대화한다고 설명했습니다."}
         ],
         "subjective": [
           {"q": "AI 교육이 전면 도입될 때 우려되는 사회적 부작용 한 가지를 지문의 키워드를 포함하여 서술하시오.", "a": "디지털 소외 계층이 발생하여 정보 및 교육 격차가 심화될 우려가 있다.", "e": "지문에서 제시한 정보 불평등 및 디지털 격차 문제를 정확히 짚었는지 평가합니다."}
         ],
         "blankInfer": [{"q": "AI 교육은 정보 인프라 차이에 따라 (  디지털 격차  )를 심화시킬 우려가 존재한다.", "a": "디지털 격차"}],
         "ordering": [{"q": "글의 논리적 흐름에 맞게 배열하시오. \n(A) 디지털 격차 등 부작용 대책 수립\n(B) AI 기술의 급격한 발전\n(C) 교육 현장 도입 및 맞춤형 학습 활성화", "a": "B-C-A"}],
         "matching": [{"q": "다음 중 지문의 내용과 일치하는 설명만을 고르시오.", "a": "AI는 학습자의 데이터를 기반으로 약점을 추적할 수 있다."}]
      },
      "importantSentences": [
        {"text": "급격한 기술 발전 속에서도 인간 중심의 교육적 가치와 균형 잡힌 시각을 잃지 말아야 한다.", "importance": "high", "reason": "이 지문의 핵심 주제문이며 필자가 최종적으로 독자에게 전달하고자 하는 주장이 직접 드러난 부분입니다."}
      ]
    });
}
