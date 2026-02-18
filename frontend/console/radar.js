/**
 * Threat Radar Visualization
 */
const canvas = document.getElementById('threat-radar');
const ctx = canvas.getContext('2d');
const log = document.getElementById('threat-log');

let width, height;
let threats = [];
let angle = 0;

function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
}

function spawnThreat() {
    if (threats.length < 5) {
        const r = Math.random() * (width / 2 - 20);
        const a = Math.random() * Math.PI * 2;
        threats.push({
            x: width / 2 + Math.cos(a) * r,
            y: height / 2 + Math.sin(a) * r,
            life: 100,
            id: 'T-' + Math.floor(Math.random() * 9999)
        });

        // Log it
        const div = document.createElement('div');
        div.className = 'threat-item critical';
        div.innerHTML = `<span>DETECTED ${threats[threats.length - 1].id}</span><span>INTRUSION</span>`;
        log.prepend(div);
        if (log.children.length > 10) log.lastChild.remove();
    }
}

function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(0, 10, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Draw Grid
    ctx.strokeStyle = '#004400';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    // Draw Scanner
    angle += 0.05;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();

    // Draw Threats
    ctx.fillStyle = '#ff0000';
    threats.forEach((t, i) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Random jitter
        t.life--;
        if (t.life <= 0) threats.splice(i, 1);
    });

    if (Math.random() > 0.98) spawnThreat();

    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();
