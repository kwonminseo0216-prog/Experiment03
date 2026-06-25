// 예상 문제 영역 주입 및 해설 바인딩 모듈
window.renderExamQuestions = function(questions) {
    const area = document.getElementById("questionsArea");
    area.innerHTML = "<h2>🎯 AI 적중 출제 예상 문제</h2>";
    
    // 글로벌 채점 타겟 오브젝트 보관 초기화
    window.currentQuizData = questions;

    let qIndex = 1;

    // 1. 객관식 문제 렌더링 문법
    if(questions.multipleChoice) {
        questions.multipleChoice.forEach((item, idx) => {
            let optionsHtml = '';
            item.o.forEach((opt, oIdx) => {
                optionsHtml += `<label class="quiz-option"><input type="radio" name="mc_${idx}" value="${oIdx + 1}"> ${opt}</label><br>`;
            });
            area.innerHTML += `
                <div class="quiz-item card" data-type="mc" data-idx="${idx}">
                    <p><strong>[문제 ${qIndex++}] (객관식)</strong> ${item.q}</p>
                    <div class="options-group">${optionsHtml}</div>
                    <div class="solution hidden" id="sol_mc_${idx}">❌ 정답: ${item.a}번 <br>💡 해설: ${item.e}</div>
                </div>
            `;
        });
    }

    // 2. OX 문제 선지 빌드
    if(questions.ox) {
        questions.ox.forEach((item, idx) => {
            area.innerHTML += `
                <div class="quiz-item card" data-type="ox" data-idx="${idx}">
                    <p><strong>[문제 ${qIndex++}] (O/X형)</strong> ${item.q}</p>
                    <label><input type="radio" name="ox_${idx}" value="O"> O</label> &nbsp;&nbsp;
                    <label><input type="radio" name="ox_${idx}" value="X"> X</label>
                    <div class="solution hidden" id="sol_ox_${idx}">❌ 정답: ${item.a} <br>💡 해설: ${item.e}</div>
                </div>
            `;
        });
    }

    // 3. 서술형 문항 렌더링
    if(questions.subjective) {
        questions.subjective.forEach((item, idx) => {
            area.innerHTML += `
                <div class="quiz-item card" data-type="subj">
                    <p><strong>[문제 ${qIndex++}] (서술형)</strong> ${item.q}</p>
                    <textarea placeholder="정답을 직접 기입해보세요." rows="2"></textarea>
                    <div class="solution hidden" id="sol_subj_${idx}">🔑 모범 답안: ${item.a} <br>💡 출제 의도: ${item.e}</div>
                </div>
            `;
        });
    }

    // 버튼 활성화 노출 제어
    document.getElementById("gradeBtn").style.display = "block";
};

