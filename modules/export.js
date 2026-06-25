// 다용도 데이터 익스포트 코어 커맨더
document.getElementById("btnCopy").addEventListener("click", () => {
    const targetText = document.getElementById("analysisResult").innerText;
    navigator.clipboard.writeText(targetText)
        .then(() => alert("분석 결과 텍스트가 클립보드에 복사되었습니다."))
        .catch(err => console.error("복사 오류: ", err));
});

document.getElementById("btnExportTxt").addEventListener("click", () => {
    const text = document.getElementById("analysisResult").innerText;
    triggerFileDownload(text, "지문분석보고서.txt", "text/plain");
});

document.getElementById("btnExportMd").addEventListener("click", () => {
    const rawData = AppState.analysisData;
    if(!rawData) return alert("분석 데이터가 존재하지 않습니다.");
    let mdText = `# 지문 분석 요약 보고서\n\n## 중심 요지\n${rawData.mainIdea}\n\n## 3줄 요약\n${rawData.summary}`;
    triggerFileDownload(mdText, "지문분석보고서.md", "text/markdown");
});

document.getElementById("btnExportPdf").addEventListener("click", () => {
    const element = document.getElementById("tab-analysis");
    const opt = {
        margin:       10,
        filename:     'AI_지문_학습_리포트.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

function triggerFileDownload(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

