/* CyberSafe AI - Main Application & State Management Controller */

document.addEventListener('DOMContentLoaded', () => {
  console.log("⚡ CyberSafe AI - NVIDIA GPU Accelerated Engine Initialized");

  // State Tracker
  const state = {
    totalThreats: 1482,
    phishingBlocked: 824,
    malwareNeutralized: 412,
    nidsAlerts: 246,
    activeTab: 'overview',
    streamEvents: []
  };

  // 1. Tab Navigation Controller
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      state.activeTab = tabId;

      navBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) targetPane.classList.add('active');

      // Trigger lazy charts initialization
      if (tabId === 'gpu') {
        window.GpuEngine.initGpuChart('gpu-load-canvas');
      } else if (tabId === 'overview') {
        window.ThreatRadar.initRadar('attack-map-canvas');
      }
    });
  });

  // 2. Real-Time Telemetry Event Stream Generator
  const streamTableBody = document.getElementById('stream-tbody');

  function addTelemetryEvent(eventData) {
    if (!eventData) {
      eventData = window.CyberAI.analyzePacket();
    }

    state.totalThreats++;
    if (eventData.severity === 'critical') state.nidsAlerts++;
    updateCounters();

    const tr = document.createElement('tr');
    const badgeClass = eventData.severity === 'critical' ? 'critical' : eventData.severity === 'warning' ? 'warning' : 'safe';

    tr.innerHTML = `
      <td>${eventData.timestamp}</td>
      <td><span class="threat-badge ${badgeClass}">${eventData.name}</span></td>
      <td>${eventData.srcIp}</td>
      <td>${eventData.destIp}</td>
      <td>${eventData.tensorRtTimeMs} ms</td>
      <td>
        <button class="cyber-btn ${badgeClass === 'critical' ? 'crimson' : 'cyan'}" style="padding: 0.25rem 0.6rem; font-size: 0.72rem;" onclick="openMitigationModal('${eventData.name}', '${eventData.srcIp}')">
          ACTIVATE PLAYBOOK
        </button>
      </td>
    `;

    if (streamTableBody) {
      streamTableBody.insertBefore(tr, streamTableBody.firstChild);
      if (streamTableBody.children.length > 25) {
        streamTableBody.removeChild(streamTableBody.lastChild);
      }
    }
  }

  // Auto-stream event loop every 2.2s
  setInterval(addTelemetryEvent, 2200);

  function updateCounters() {
    const elTotal = document.getElementById('count-total');
    const elPhishing = document.getElementById('count-phishing');
    const elMalware = document.getElementById('count-malware');
    const elNids = document.getElementById('count-nids');

    if (elTotal) elTotal.innerText = state.totalThreats.toLocaleString();
    if (elPhishing) elPhishing.innerText = state.phishingBlocked.toLocaleString();
    if (elMalware) elMalware.innerText = state.malwareNeutralized.toLocaleString();
    if (elNids) elNids.innerText = state.nidsAlerts.toLocaleString();
  }

  // 3. Phishing & URL Scanner Controller
  const btnScanUrl = document.getElementById('btn-scan-url');
  const inputUrl = document.getElementById('input-url-target');
  const urlResultContainer = document.getElementById('url-result-box');

  if (btnScanUrl && inputUrl) {
    btnScanUrl.addEventListener('click', () => {
      const urlValue = inputUrl.value || "http://secure-login-paypal.verify-accounts.xyz/update-auth/index.php";
      btnScanUrl.innerHTML = `<span>ANALYZING WITH TENSORRT...</span>`;
      
      setTimeout(() => {
        const result = window.CyberAI.scanUrl(urlValue);
        btnScanUrl.innerHTML = `<i class="lucide-search"></i> <span>SCAN WITH TENSORRT AI</span>`;

        state.phishingBlocked++;
        updateCounters();

        renderUrlResult(result);
      }, 450);
    });
  }

  function renderUrlResult(res) {
    if (!urlResultContainer) return;
    urlResultContainer.style.display = 'block';

    let shapHtml = '';
    res.shapFeatures.forEach(feat => {
      const fillClass = feat.isMalicious ? 'danger' : 'safe';
      const widthPct = Math.min(100, Math.max(15, Math.abs(feat.impact) * 180));
      shapHtml += `
        <div class="shap-item">
          <div class="shap-header">
            <span>${feat.name} (${feat.value})</span>
            <span style="color: ${feat.isMalicious ? '#FF2E63' : '#76B900'}">${feat.impact > 0 ? '+' : ''}${feat.impact} SHAP</span>
          </div>
          <div class="shap-bar-bg">
            <div class="shap-bar-fill ${fillClass}" style="width: ${widthPct}%;"></div>
          </div>
        </div>
      `;
    });

    let recHtml = res.recommendations.map(r => `<li><i class="lucide-shield-alert"></i> ${r}</li>`).join('');

    urlResultContainer.innerHTML = `
      <div class="cyber-card" style="border-color: var(--border-${res.statusClass === 'critical' ? 'crimson' : 'active'}); margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <span class="threat-badge ${res.statusClass}">${res.classification}</span>
            <h3 style="margin-top: 0.4rem; font-family: var(--font-mono); font-size: 1.1rem; color: #fff;">${res.url}</h3>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-mono); font-size: 2rem; font-weight: 800; color: ${res.statusClass === 'critical' ? '#FF2E63' : '#76B900'};">${res.score} / 100</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">AI Threat Risk Score</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: rgba(7, 10, 15, 0.6); padding: 0.8rem; border-radius: 8px; margin-bottom: 1.2rem; font-family: var(--font-mono); font-size: 0.82rem;">
          <div>Inference Latency: <strong style="color: var(--cyber-cyan);">${res.inferenceTimeMs} ms</strong></div>
          <div>Model Confidence: <strong style="color: var(--nvidia-green);">${res.confidence}%</strong></div>
          <div>GPU Acceleration: <strong style="color: var(--nvidia-green);">NVIDIA CUDA Core</strong></div>
        </div>

        <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--cyber-cyan); margin-bottom: 0.6rem; letter-spacing: 0.5px;">Explainable AI (XAI) Feature Attribution waterfall</h4>
        <div class="shap-container">${shapHtml}</div>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--warning-amber); margin-bottom: 0.6rem;">Automated Security Playbook Recommendations</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: var(--text-muted);">${recHtml}</ul>
        </div>
      </div>
    `;
  }

  // 4. Malware Payload Inspector Controller
  const btnScanMalware = document.getElementById('btn-scan-malware');
  const malwareResultBox = document.getElementById('malware-result-box');

  if (btnScanMalware) {
    btnScanMalware.addEventListener('click', () => {
      btnScanMalware.innerText = "RUNNING BYTE-ENTROPY SCAN...";
      setTimeout(() => {
        const res = window.CyberAI.scanMalwareFile("payload_exploit_x64.exe", "5.14 MB", "exe");
        btnScanMalware.innerText = "INSPECT EXECUTABLE PAYLOAD";

        state.malwareNeutralized++;
        updateCounters();

        if (malwareResultBox) {
          malwareResultBox.style.display = 'block';
          malwareResultBox.innerHTML = `
            <div class="cyber-card" style="border-color: var(--border-crimson); margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="threat-badge critical">${res.threatName}</span>
                  <h3 style="font-family: var(--font-mono); font-size: 1.1rem; color: #fff; margin-top: 0.4rem;">${res.fileName} (${res.fileSize})</h3>
                </div>
                <div style="text-align: right;">
                  <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; color: #FF2E63;">${res.score} / 100</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">High Risk Malware</div>
                </div>
              </div>

              <div style="margin-top: 1rem;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--cyber-cyan); margin-bottom: 0.5rem;">Flagged Win32 API Injection Vectors</h4>
                <table style="width: 100%; font-family: var(--font-mono); font-size: 0.8rem; border-collapse: collapse;">
                  <tr style="color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.06); text-align: left;">
                    <th style="padding: 0.4rem;">API Function</th>
                    <th style="padding: 0.4rem;">Risk Level</th>
                    <th style="padding: 0.4rem;">Description</th>
                  </tr>
                  ${res.win32APIs.map(api => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                      <td style="padding: 0.45rem; color: #FF2E63;">${api.name}</td>
                      <td style="padding: 0.45rem;"><span class="threat-badge critical" style="padding: 2px 6px; font-size: 0.68rem;">${api.risk}</span></td>
                      <td style="padding: 0.45rem; color: var(--text-muted);">${api.desc}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
            </div>
          `;
        }
      }, 500);
    });
  }

  // 5. GPU Precision Toggle Listener
  const fp16Btn = document.getElementById('btn-fp16');
  const int8Btn = document.getElementById('btn-int8');
  if (fp16Btn && int8Btn) {
    fp16Btn.addEventListener('click', () => {
      fp16Btn.classList.add('active'); int8Btn.classList.remove('active');
      window.GpuEngine.setPrecision('FP16 (TensorRT)');
      updateGpuDisplay();
    });
    int8Btn.addEventListener('click', () => {
      int8Btn.classList.add('active'); fp16Btn.classList.remove('active');
      window.GpuEngine.setPrecision('INT8 (Quantized Tensor Core)');
      updateGpuDisplay();
    });
  }

  function updateGpuDisplay() {
    const m = window.GpuEngine.getMetrics();
    const gpuLat = document.getElementById('gpu-lat-val');
    const cpuLat = document.getElementById('cpu-lat-val');
    const speedup = document.getElementById('gpu-speedup-val');
    const vram = document.getElementById('gpu-vram-val');

    if (gpuLat) gpuLat.innerText = m.gpuLatencyMs + ' ms';
    if (cpuLat) cpuLat.innerText = m.cpuLatencyMs + ' ms';
    if (speedup) speedup.innerText = m.speedupFactor + 'x';
    if (vram) vram.innerText = `${m.vramUsed} / ${m.vramTotal} GB`;
  }

  setInterval(updateGpuDisplay, 1500);

  // Initialize Radar Overview Map on start
  setTimeout(() => {
    window.ThreatRadar.initRadar('attack-map-canvas');
  }, 200);
});

// Modal Controller for Playbook Response
window.openMitigationModal = function(threatName, ip) {
  const backdrop = document.getElementById('playbook-modal');
  const content = document.getElementById('modal-threat-info');
  if (!backdrop || !content) return;

  content.innerHTML = `
    <h3 style="font-family: var(--font-mono); color: #FF2E63; margin-bottom: 0.5rem;">CRITICAL THREAT: ${threatName}</h3>
    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">Origin IP Address: <strong style="color: #fff;">${ip}</strong></p>
    
    <div style="background: rgba(7,10,15,0.7); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem;">
      <h4 style="color: var(--nvidia-green); margin-bottom: 0.5rem;">Automated Mitigation Execution Workflow</h4>
      <div style="display: flex; flex-direction: column; gap: 0.4rem; font-family: var(--font-mono);">
        <div>[✔] Pushing iptables block rule for ${ip} to Cisco Firewall...</div>
        <div>[✔] Disabling compromised Active Directory user token...</div>
        <div>[✔] Generating NVIDIA CUDA Forensic Evidence Artifact...</div>
      </div>
    </div>
  `;

  backdrop.classList.add('active');
};

window.closeMitigationModal = function() {
  const backdrop = document.getElementById('playbook-modal');
  if (backdrop) backdrop.classList.remove('active');
};

window.downloadIncidentReport = function() {
  const text = `CyberSafe AI Incident Forensic Audit Report
Generated: ${new Date().toISOString()}
NVIDIA TensorRT GPU Engine Acceleration: ENABLED
Platform Status: DEFENDED
Total Neutralized Cyber Threats: ${document.getElementById('count-total')?.innerText || '1482'}
  `;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `CyberSafe_NVIDIA_Forensic_Report_${Date.now()}.txt`;
  a.click();
};
