/**
 * Aegis Landing Page Interaction
 * Simulates a high-tech industrial interface.
 */

// 1. Neuro-Grid Background Visualization (Canvas)
const canvas = document.getElementById('neuro-grid');
const ctx = canvas.getContext('2d');
let width, height;
let points = [];

const termLog = document.getElementById('terminal-output');

async function fetchSystemStatus() {
    try {
        const response = await fetch('http://localhost:8000/api/system/status');
        const data = await response.json();
        return data;
    } catch (e) {
        console.warn("Backend offline, using simulation mode.");
        return null;
    }
}

async function initNetwork() {
    // Check Backend
    const status = await fetchSystemStatus();
    if (status) {
        document.querySelector('.status-indicator').innerHTML = `<span class="blink"></span> SYSTEM: ONLINE (PHASE ${52})`;
    }

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initPoints();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initPoints();
}

function initPoints() {
    points = [];
    const density = Math.floor(width / 40); // Grid density
    for (let i = 0; i < density; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a1a'; // Dark Grid Points
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)'; // Faint Blue Lines

    // Update and draw points
    points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw lines between close points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

// 2. Terminal Text Simulation
const terminalElement = document.getElementById('terminal-output');
const commands = [
    "> INITIALIZING ASON CORE...",
    "> CONNECTING TO LOCAL MESH NETWORK [SECURE]...",
    "> VERIFYING ISO 26262 COMPLIANCE...",
    "> MODULE: ENERGY_OPTIMIZER [ONLINE]",
    "> MODULE: THREAT_DETECTION [ONLINE]",
    "> MODULE: PREDICTIVE_MAINTENANCE [ONLINE]",
    "> STATUS: 100% OPERATIONAL",
    "> AWAITING INPUT_"
];

let cmdIndex = 0;
let charIndex = 0;

function typeTerminal() {
    if (cmdIndex < commands.length) {
        if (charIndex < commands[cmdIndex].length) {
            terminalElement.innerHTML += commands[cmdIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeTerminal, 30); // Typing speed
        } else {
            terminalElement.innerHTML += "<br>";
            cmdIndex++;
            charIndex = 0;
            setTimeout(typeTerminal, 500); // Pause between lines
        }
    }
}

// Initialize
window.addEventListener('resize', resize);
initNetwork(); // Replaces resize() initial call
draw();
setTimeout(typeTerminal, 1000); // Start terminal after slight delay
