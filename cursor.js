/* CyberSafe AI - Interactive HUD Reticle Cursor Engine */

(function initCyberCursor() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cyber-cursor-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    hovered: false,
    hoverRect: null,
    clicking: false
  };

  const particles = [];
  const shockwaves = [];
  let angle = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    // Check hovered interactive elements
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (elem && (elem.closest('button') || elem.closest('.cyber-card') || elem.closest('input') || elem.closest('.nav-btn') || elem.closest('tr'))) {
      mouse.hovered = true;
      const target = elem.closest('button') || elem.closest('.cyber-card') || elem.closest('input') || elem.closest('.nav-btn') || elem.closest('tr');
      mouse.hoverRect = target.getBoundingClientRect();
    } else {
      mouse.hovered = false;
      mouse.hoverRect = null;
    }

    // Add trailing telemetry particle
    if (Math.random() < 0.6) {
      particles.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2.5 + 1,
        life: 1,
        color: Math.random() > 0.5 ? '#76B900' : '#00F0FF'
      });
    }
  });

  window.addEventListener('mousedown', (e) => {
    mouse.clicking = true;
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 45,
      alpha: 1,
      color: '#FF2E63'
    });
  });

  window.addEventListener('mouseup', () => {
    mouse.clicking = false;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth interpolation (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.25;
    mouse.y += (mouse.targetY - mouse.y) * 0.25;

    // 1. Render Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 46, 99, ${sw.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      sw.radius += 2.5;
      sw.alpha -= 0.04;
      if (sw.alpha <= 0) shockwaves.splice(i, 1);
    }

    // 2. Render Trailing Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.7;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // 3. Render Reticle Crosshair HUD
    angle += 0.02;

    const size = mouse.hovered ? 24 : 16;
    const color = mouse.hovered ? '#00F0FF' : '#76B900';

    ctx.save();
    ctx.translate(mouse.x, mouse.y);

    // Rotating Outer Ring
    ctx.beginPath();
    ctx.arc(0, 0, size + 6, angle, angle + Math.PI * 1.5);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner Dot
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = mouse.clicking ? '#FF2E63' : color;
    ctx.fill();

    // Crosshair Lines
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    // Top
    ctx.moveTo(0, -size); ctx.lineTo(0, -size + 5);
    // Bottom
    ctx.moveTo(0, size); ctx.lineTo(0, size - 5);
    // Left
    ctx.moveTo(-size, 0); ctx.lineTo(-size + 5, 0);
    // Right
    ctx.moveTo(size, 0); ctx.lineTo(size - 5, 0);
    ctx.stroke();

    // Small HUD Telemetry Coordinate Text
    ctx.font = '9px "JetBrains Mono"';
    ctx.fillStyle = 'rgba(118, 185, 0, 0.7)';
    ctx.fillText(`X:${Math.round(mouse.x)} Y:${Math.round(mouse.y)}`, 16, -16);

    ctx.restore();

    // 4. Render Target Locking Box when Hovered
    if (mouse.hovered && mouse.hoverRect) {
      const rect = mouse.hoverRect;
      const cornerSize = 8;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.lineWidth = 2;

      // Top-Left Corner
      ctx.beginPath();
      ctx.moveTo(rect.left - 4, rect.top - 4 + cornerSize);
      ctx.lineTo(rect.left - 4, rect.top - 4);
      ctx.lineTo(rect.left - 4 + cornerSize, rect.top - 4);
      ctx.stroke();

      // Top-Right Corner
      ctx.beginPath();
      ctx.moveTo(rect.right + 4 - cornerSize, rect.top - 4);
      ctx.lineTo(rect.right + 4, rect.top - 4);
      ctx.lineTo(rect.right + 4, rect.top - 4 + cornerSize);
      ctx.stroke();

      // Bottom-Left Corner
      ctx.beginPath();
      ctx.moveTo(rect.left - 4, rect.bottom + 4 - cornerSize);
      ctx.lineTo(rect.left - 4, rect.bottom + 4);
      ctx.lineTo(rect.left - 4 + cornerSize, rect.bottom + 4);
      ctx.stroke();

      // Bottom-Right Corner
      ctx.beginPath();
      ctx.moveTo(rect.right + 4 - cornerSize, rect.bottom + 4);
      ctx.lineTo(rect.right + 4, rect.bottom + 4);
      ctx.lineTo(rect.right + 4, rect.bottom + 4 - cornerSize);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
