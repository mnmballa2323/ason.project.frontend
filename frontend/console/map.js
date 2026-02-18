/**
 * Global Infrastructure Map
 */
const mapCanvas = document.getElementById('world-map');
const mapCtx = mapCanvas.getContext('2d');
const sysLog = document.getElementById('system-log');

let mapW, mapH;
let nodes = [];

function initMap() {
    const parent = mapCanvas.parentElement;
    mapW = mapCanvas.width = parent.clientWidth;
    mapH = mapCanvas.height = parent.clientHeight;

    // Create random nodes roughly representing continents
    for (let i = 0; i < 50; i++) {
        nodes.push({
            x: Math.random() * mapW,
            y: Math.random() * mapH,
            status: 'OK'
        });
    }
}

function logMsg(msg) {
    sysLog.innerHTML += `> ${msg}<br>`;
    sysLog.scrollTop = sysLog.scrollHeight;
}

function drawMap() {
    mapCtx.clearRect(0, 0, mapW, mapH);

    // Draw connections
    mapCtx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
    mapCtx.lineWidth = 0.5;
    mapCtx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d < 100) {
                mapCtx.moveTo(nodes[i].x, nodes[i].y);
                mapCtx.lineTo(nodes[j].x, nodes[j].y);
            }
        }
    }
    mapCtx.stroke();

    // Draw nodes
    nodes.forEach(n => {
        mapCtx.fillStyle = n.status === 'OK' ? '#00ff00' : '#ff0000';
        mapCtx.beginPath();
        mapCtx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        mapCtx.fill();

        // Ping effect
        if (Math.random() > 0.99) {
            mapCtx.strokeStyle = n.status === 'OK' ? '#00ff00' : '#ff0000';
            mapCtx.beginPath();
            mapCtx.arc(n.x, n.y, 10, 0, Math.PI * 2);
            mapCtx.stroke();

            if (Math.random() > 0.8) logMsg(`NODE_SYNC: ${Math.floor(n.x)},${Math.floor(n.y)} OK`);
        }
    });

    requestAnimationFrame(drawMap);
}

window.addEventListener('resize', initMap);
initMap();
drawMap();
