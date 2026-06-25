// 지문 분석 락 기반 하위 개념 AI 질문 보충 어시스턴트
document.getElementById("chatSendBtn").addEventListener("click", async () => {
    const chatInput = document.getElementById("chatInput");
    const query = chatInput.value.trim();
    if(!query) return;

    const chatArea = document.getElementById("chatArea");
    chatArea.innerHTML += `<div><strong>🙋 나:</strong> ${query}</div>`;
    chatInput.value = "";

    // 실시간 비동기 추가 탐색 호출
    if(!AppState.apiKey) {
         chatArea.innerHTML += `<div><strong>🤖 AI 선생님:</strong> 상단 API 키가 등록되지 않아 답변이 불가능합니다.</div>`;
         return;
    }

    try {
        const followUpPrompt = `지문 context: [${AppState.textA}]\n질문사항: [${query}]\n입시 강사 관점에서 친절하게 2문장 내외로 요약 설명해줘.`;
        const resp = await requestToLLM(followUpPrompt, AppState.apiKey);
        chatArea.innerHTML += `<div><strong>🤖 AI 선생님:</strong> ${resp}</div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    } catch(e) {
        chatArea.innerHTML += `<div><strong>🤖 AI 선생님:</strong> 오류가 유발되었습니다. 다시 시도바랍니다.</div>`;
    }
});

