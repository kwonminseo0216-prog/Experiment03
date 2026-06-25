// 에빙하우스 망각곡선 기반 최적 주기 복습 스케줄러
document.addEventListener("DOMContentLoaded", () => {
    const plannerList = document.getElementById("plannerList");
    // 초기 로딩용 가상 일정 더미 배치 가독성 확보
    plannerList.innerHTML = `
        <li>📅 1일 후 (내일) 복습 예정 권장</li>
        <li>📅 7일 후 심화 변형 풀이 주기</li>
        <li>📅 30일 후 장기 기억 최종 점검</li>
    `;
});

