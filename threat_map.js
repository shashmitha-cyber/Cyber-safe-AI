/* CyberSafe AI - Global Cyber Threat Attack Radar Sweep Engine */

window.ThreatRadar = {
  initRadar: function(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.parentElement.clientWidth || 700;
    let height = canvas.height = 340;

    window.addEventListener('resize', () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 340;
      }
    });

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;

    let sweepAngle = 0;

    // Simulated attack nodes on map
    const attackNodes = [
      { x: centerX - 180, y: centerY - 60, label: "US-EAST (185.220.101.4)", type: "DDoS", severity: "critical", radius: 6 },
      { x: centerX + 150, y: centerY - 80, label: "EU-WEST (194.26.29.112)", type: "Phishing", severity: "warning", radius: 5 },
      { x: centerX + 210, y: centerY + 50, label: "AP-SOUTH (91.240.118.172)", type: "SQLi", severity: "critical", radius: 7 },
      { x: centerX - 90, y: centerY + 70, label: "LATAM (45.142.214.8)", type: "C2 Exfil", severity: "critical", radius: 6 },
      { x: centerX + 40, y: centerY - 110, label: "EU-CENTRAL (10.0.4.15)", type: "Clean", severity: "safe", radius: 4 }
    ];

    // Animated lasers trajectory
    const lasers = [];
    setInterval(() => {
      const source = attackNodes[Math.floor(Math.random() * (attackNodes.length - 1))];
      lasers.push({
        x1: source.x,
        y1: source.y,
        x2: centerX,
        y2: centerY,
        progress: 0,
        color: source.severity === 'critical' ? '#FF2E63' : '#FF9F1C'
      });
    }, 1200);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 1. Concentric Grid Circles
      ctx.strokeStyle = 'rgba(118, 185, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let r = maxRadius; r > 0; r -= maxRadius / 4) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius - 20, centerY); ctx.lineTo(centerX + maxRadius + 20, centerY);
      ctx.moveTo(centerX, centerY - maxRadius - 20); ctx.lineTo(centerX, centerY + maxRadius + 20);
      ctx.stroke();

      // 2. Radar Sweep Beam
      sweepAngle += 0.025;
      ctx.save();
      ctx.translate(centerX, centerY);
      
      const sweepGrad = ctx.createConicGradient(sweepAngle, 0, 0);
      sweepGrad.addColorStop(0, 'rgba(118, 185, 0, 0.4)');
      sweepGrad.addColorStop(0.15, 'rgba(118, 185, 0, 0.05)');
      sweepGrad.addColorStop(1, 'rgba(118, 185, 0, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // 3. Center Gateway Target
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '10px "JetBrains Mono"';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText("HQ GATEWAY", centerX + 12, centerY + 4);

      // 4. Draw Lasers
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.progress += 0.04;

        const currentX = l.x1 + (l.x2 - l.x1) * l.progress;
        const currentY = l.y1 + (l.y2 - l.y1) * l.progress;

        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (l.progress >= 1) lasers.splice(i, 1);
      }

      // 5. Draw Attack Nodes
      attackNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.severity === 'critical' ? '#FF2E63' : node.severity === 'warning' ? '#FF9F1C' : '#76B900';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '9px "JetBrains Mono"';
        ctx.fillStyle = '#8A99AD';
        ctx.fillText(node.label, node.x + 10, node.y + 3);
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }
};
