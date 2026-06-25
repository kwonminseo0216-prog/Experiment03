// 지문 분석 프롬프트 및 응답 가공 처리 엔진
window.buildPrompt = function(textA, grade, textB) {
    const isEnglish = /[a-zA-Z]{10,}/.test(textA); 
    const langMode = isEnglish ? "영어" : "국어";

    let basePrompt = `당신은 대한민국 최고의 입시 전문 국어/영어 강사이자 교육 공학자입니다.
대상 학생 학년: [${grade}]
입력된 지문은 [${langMode}] 영역입니다. 

다음 지문을 완벽하게 심층 분석하여 반드시 유효한 단일 JSON 객체 형태로만 출력해 주세요. 마크다운 태그 기호(\`\`\`json)는 생략하거나 감싸서 반환하되 텍스트 파싱이 가능해야 합니다.

[분석 타겟 지문 A]
${textA}
`;

    if(textB) {
        basePrompt += `\n[비교 분석 타겟 지문 B]\n${textB}\n\n두 지문을 상호 비교하는 종합 구조 보고서 내용도 JSON 내 'comparison' 필드에 추가해 주세요.`;
    }

    basePrompt += `
\n반드시 아래 요구사항의 키를 가진 JSON 포맷을 준수해야 합니다:
{
  "summary": "지문 전체의 정밀한 3줄 요약 문단",
  "mainIdea": "지문의 궁극적 중심 내용 및 요지",
  "coreMessage": "작가가 전달하고자 하는 핵심 메시지 및 교훈",
  "keywords": [{"word": "키워드1", "weight": 90, "desc": "설명1"}, {"word": "키워드2", "weight": 75, "desc": "설명2"}],
  "structure": "원인→과정→결과 또는 기승전결 형태의 텍스트 기반 계층 분석 설명",
  "mermaid": "graph TD 형태로 구성된 지문 논리 도식화 코드",
  "questions": {
     "multipleChoice": [{"q": "문제", "o": ["1번","2번","3번","4번","5번"], "a": 1, "e": "해설"}],
     "ox": [{"q": "OX문제 문장", "a": "O", "e": "해설"}],
     "subjective": [{"q": "서술형 문항", "a": "예시정답", "e": "출제의도"}],
     "blankInfer": [{"q": "빈칸이 있는 문장", "a": "정답단어"}],
     "ordering": [{"q": "뒤섞인 문단 배열 문제", "a": "A-C-B형태"}],
     "matching": [{"q": "내용 불일치/일치 판단용 선지", "a": "정답 고르기"}]
  },
  "importantSentences": [{"text": "원문 내 핵심 문장 그대로 발췌", "importance": "high", "reason": "출제 사유"}]
}`;
    return basePrompt;
};

window.processAnalysisResult = function(rawText) {
    let cleanJsonStr = rawText.trim();
    if (cleanJsonStr.startsWith("```json")) cleanJsonStr = cleanJsonStr.replace(/^```json/, "");
    if (cleanJsonStr.endsWith("```")) cleanJsonStr = cleanJsonStr.replace(/```$/, "");
    cleanJsonStr = cleanJsonStr.trim();

    try {
        const data = JSON.parse(cleanJsonStr);
        AppState.analysisData = data;

        // 1. 요약 및 텍스트 데이터 출력
        let htmlContent = `
            <h3>📌 지문 중심 요지</h3> <p>${data.mainIdea}</p>
            <h3>💡 핵심 메시지</h3> <p>${data.coreMessage}</p>
            <h3>📋 3줄 핵심 요약</h3> <p>${data.summary.replace(/\n/g, '<br>')}</p>
            <h3>🏗️ 글의 논리 구조 분석</h3> <p>${data.structure.replace(/\n/g, '<br>')}</p>
        `;
        document.getElementById("analysisResult").innerHTML = htmlContent;

        // 다른 스크립트 모듈 순차적 파생 렌더링 호출
        if(window.renderHighlighter) window.renderHighlighter(data.importantSentences);
        if(window.renderSvgMindmap) window.renderSvgMindmap(data);
        if(window.renderKeywordCharts) window.renderKeywordCharts(data.keywords);
        if(window.renderWordCloud) window.renderWordCloud(data.keywords);
        if(window.setupMermaidChart) window.setupMermaidChart(data.mermaid);
        if(window.renderExamQuestions) window.renderExamQuestions(data.questions);
        if(window.renderCompareView && AppState.isCompareMode) window.renderCompareView(data.comparison);
        
        // 최근 분석 목록 추가 기록
        if(window.pushHistoryItem) window.pushHistoryItem(AppState.textA.substring(0, 20), data);

    } catch (e) {
        console.error("JSON 파싱 에러발생. 원본 데이터 컨텍스트 확인 필요: ", rawText);
        document.getElementById("analysisResult").innerHTML = `<h3>⚠️ 분석 파싱 지연 안내</h3><p>AI의 응답 구조가 표준 규격을 벗어났습니다. 원문 텍스트 형태로 임시 대체 표기합니다.</p><pre>${rawText}</pre>`;
    }
};

