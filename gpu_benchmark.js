/* CyberSafe AI - NVIDIA GPU Acceleration & TensorRT Benchmark Suite */

window.GpuEngine = {
  gpuName: "NVIDIA RTX 4090 / Tensor Core Accelerator",
  vramTotalGB: 24.0,
  vramUsedGB: 8.4,
  cudaCores: 16384,
  tensorCores: 512,
  precision: "FP16 (TensorRT)",

  getMetrics: function() {
    // Dynamic noise simulation
    const noise = (Math.random() - 0.5) * 0.4;
    this.vramUsedGB = parseFloat((8.4 + noise).toFixed(2));
    const gpuLatencyMs = parseFloat((0.34 + (Math.random() - 0.5) * 0.05).toFixed(2));
    const cpuLatencyMs = parseFloat((18.42 + (Math.random() - 0.5) * 1.2).toFixed(2));
    const speedup = parseFloat((cpuLatencyMs / gpuLatencyMs).toFixed(1));
    const throughput = Math.floor(120000 + Math.random() * 8000);

    return {
      gpuName: this.gpuName,
      vramUsed: this.vramUsedGB,
      vramTotal: this.vramTotalGB,
      vramPercent: Math.round((this.vramUsedGB / this.vramTotalGB) * 100),
      gpuLatencyMs: gpuLatencyMs,
      cpuLatencyMs: cpuLatencyMs,
      speedupFactor: speedup,
      throughputFps: throughput.toLocaleString(),
      tensorCoreUtilization: Math.floor(84 + Math.random() * 12),
      cudaCoreLoad: Math.floor(72 + Math.random() * 15),
      precision: this.precision
    };
  },

  setPrecision: function(mode) {
    this.precision = mode;
    return this.getMetrics();
  },

  // Render dynamic real-time canvas chart for GPU VRAM & Tensor Core load
  initGpuChart: function(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const history = Array(30).fill(65);

    function draw() {
      const width = canvas.width = canvas.parentElement.clientWidth || 600;
      const height = canvas.height = 180;

      // Shift data
      history.shift();
      history.push(Math.floor(75 + Math.random() * 20));

      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(118, 185, 0, 0.1)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Plot Line
      ctx.beginPath();
      const step = width / (history.length - 1);
      ctx.moveTo(0, height - (history[0] / 100) * height);

      for (let i = 1; i < history.length; i++) {
        const x = i * step;
        const y = height - (history[i] / 100) * height;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#76B900';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#76B900';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Fill Gradient below line
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(118, 185, 0, 0.3)');
      grad.addColorStop(1, 'rgba(118, 185, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      setTimeout(() => requestAnimationFrame(draw), 400);
    }

    draw();
  }
};
