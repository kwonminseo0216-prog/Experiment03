// 분석 히스토리 로그 관리 스택
window.initHistory = function() {
    window.refreshHistoryUI();
    document.getElementById("searchHistoryInput").addEventListener("input", (e) => {
        window.refreshHistoryUI(e.target.value.trim());
    });
};

window.pushHistoryItem = function(title, payload) {
    const item = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: title,
        data: payload
    };
    AppState.history.unshift(item);
    if(AppState.history.length > 100) AppState.history.pop(); // 100개 상한선 보호
    localStorage.setItem("app_history_stack", JSON.stringify(AppState.history));
    window.refreshHistoryUI();
};

window.refreshHistoryUI = function(keyword = "") {
    const list = document.getElementById("historyList");
    list.innerHTML = "";
    
    const localData = localStorage.getItem("app_history_stack");
    if(localData) AppState.history = JSON.parse(localData);

    const filtered = AppState.history.filter(h => h.title.includes(keyword));

    filtered.forEach(item => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.style.padding = "5px 0";
        li.innerHTML = `📅 [${item.date}] ${item.title}...`;
        li.addEventListener("click", () => {
            AppState.analysisData = item.data;
            window.processAnalysisResult(JSON.stringify(item.data));
        });
        list.appendChild(li);
    });
};
