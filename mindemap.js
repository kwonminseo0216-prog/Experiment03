// SVG 활용 계층 트리 구조 및 인과 흐름도 생성 엔진
window.renderSvgMindmap = function(data) {
    const container = document.getElementById("svgMindmapContainer");
    container.innerHTML = ""; // 기존 초기화

    const width = 800;
    const height = 300;
    
    // SVG 기본 골격 생성
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.background = AppState.theme === 'dark' ? '#1f2937' : '#f9fafb';

    // 메인 노드 모델 정의
    const nodes = [
        { id: 1, x: 100, y: 150, text: "원인 (Cause)", color: "#ef4444" },
        { id: 2, x: 400, y: 150, text: "과정 (Process)", color: "#3b82f6" },
        { id: 3, x: 700, y: 150, text: "결과 (Result)", color: "#10b981" }
    ];

    // 화살표 선 연결 가공
    function drawArrow(x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", AppState.theme === 'dark' ? '#6b7280' : '#9ca3af');
        line.setAttribute("stroke-width", "3");
        line.setAttribute("marker-end", "url(#arrow)");
        svg.appendChild(line);
    }

    // 마커 추가 정의
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af"/></marker>`;
    svg.appendChild(defs);

    drawArrow(180, 150, 310, 150);
    drawArrow(490, 150, 610, 150);

    // 노드 렌더링 루프
    nodes.forEach(node => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", node.x - 80);
        rect.setAttribute("y", node.y - 30);
        rect.setAttribute("width", "160");
        rect.setAttribute("height", "60");
        rect.setAttribute("rx", "10");
        rect.setAttribute("fill", node.color);
        
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", node.x);
        txt.setAttribute("y", node.y + 5);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("fill", "#ffffff");
        txt.setAttribute("font-size", "14px");
        txt.setAttribute("font-weight", "bold");
        txt.textContent = node.text;

        g.appendChild(rect);
        g.appendChild(txt);
        svg.appendChild(g);
    });

    container.appendChild(svg);
};

