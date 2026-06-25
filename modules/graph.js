// Chart.js 데이터 바인딩 래퍼 객체
let chartInstanceBar = null;
let chartInstancePie = null;

window.renderKeywordCharts = function(keywords) {
    const ctxBar = document.getElementById('keywordChartBar').getContext('2d');
    const ctxPie = document.getElementById('keywordChartPie').getContext('2d');

    // 인스턴스 초기화 기법
    if(chartInstanceBar) chartInstanceBar.destroy();
    if(chartInstancePie) chartInstancePie.destroy();

    const labels = keywords.map(k => k.word);
    const scores = keywords.map(k => k.weight);

    chartInstanceBar = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '키워드 가중치 빈도수',
                data: scores,
                backgroundColor: 'rgba(79, 70, 229, 0.6)'
            }]
        },
        options: { responsive: true }
    });

    chartInstancePie = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: scores,
                backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#6366f1']
            }]
        },
        options: { responsive: true }
    });
};

