// Tesseract.js 기반 광학 문자 가독 엔진
window.runOcrEngine = function(fileObj) {
    const reader = new FileReader();
    reader.onload = function() {
        const dataUrl = reader.result;
        
        // 유저 알림 가시화
        document.getElementById("inputText").placeholder = "📷 이미지에서 문자를 분석 추출하고 있습니다. 잠시만 고대해 주세요...";
        
        Tesseract.recognize(
          dataUrl,
          'kor+eng', // 국한문 혼용 및 영어 복합 매칭 모드 설정
          { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            document.getElementById("inputText").value = text;
            document.getElementById("inputText").placeholder = "분석할 국어 또는 영어 지문을 입력하세요...";
        }).catch(err => {
            console.error(err);
            alert("OCR 가공 도중 장치 에러가 유발되었습니다.");
        });
    };
    reader.readAsDataURL(fileObj);
};

