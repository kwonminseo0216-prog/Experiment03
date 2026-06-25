// 드래그 앤 드롭 멀티 파일 전처리기 인터페이스
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--secondary-color)";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "var(--primary-color)";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--primary-color)";
    const files = e.dataTransfer.files;
    if(files.length > 0) handleFileParsing(files[0]);
});

fileInput.addEventListener("change", (e) => {
    if(e.target.files.length > 0) handleFileParsing(e.target.files[0]);
});

function handleFileParsing(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'txt') {
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById("inputText").value = e.target.result; };
        reader.readAsText(file, "UTF-8");
    } else if (ext === 'docx') {
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
            mammoth.extractRawText({ arrayBuffer: loadEvent.target.result })
                .then(result => { document.getElementById("inputText").value = result.value; })
                .catch(err => console.error(err));
        };
        reader.readAsArrayBuffer(file);
    } else if (ext === 'pdf') {
        const reader = new FileReader();
        reader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                let maxPages = pdf.numPages;
                let countPromises = [];
                for (let j = 1; j <= maxPages; j++) {
                    countPromises.push(pdf.getPage(j).then(page => page.getTextContent().then(text => {
                        return text.items.map(s => s.str).join('');
                    })));
                }
                Promise.all(countPromises).then(texts => {
                    document.getElementById("inputText").value = texts.join('\n');
                });
            });
        };
        reader.readAsArrayBuffer(file);
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
        // 이미지는 OCR 모듈 스코프로 전권 이양 처리
        if (window.runOcrEngine) window.runOcrEngine(file);
    } else {
        alert("지원하지 않는 포맷입니다.");
    }
}

