// ===== CERTIFICATE SECTION =====
let certUserName = '';
let certId = '';
let certGenerated = false;

function escHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateCertificateId() {
  return 'IGM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ===== PROGRESS FUNCTIONS (ISOLATED COPY) =====
function loadProgress() {
  try {
    const data = localStorage.getItem('igMasteryProgress');
    return data ? JSON.parse(data) : { completed: [], lastSection: null };
  } catch { return { completed: [], lastSection: null }; }
}

function saveProgress(progress) {
  try { localStorage.setItem('igMasteryProgress', JSON.stringify(progress)); } catch {}
}

function getTotalSections() {
  if (typeof sectionData !== 'undefined' && Array.isArray(sectionData)) {
    return [...new Set(sectionData.map(s => s.id))].length;
  }
  return 0;
}

function loadCertData() {
  const data = localStorage.getItem('certificateData');
  if (data) {
    const parsed = JSON.parse(data);
    certUserName = parsed.name || '';
    certId = parsed.id || '';
    certGenerated = parsed.generated || false;
  }
}

function saveCertData(name, id) {
  localStorage.setItem('certificateData', JSON.stringify({
    name: name,
    id: id,
    generated: true
  }));
}

function isCertificateUnlocked() {
  const progress = loadProgress();
  const totalSections = getTotalSections();
  const sectionIds = typeof sectionData !== 'undefined' && Array.isArray(sectionData)
    ? sectionData.map(s => 's-' + s.id) : [];
  const completedSections = progress.completed.filter(function (id) {
    return sectionIds.indexOf(id) !== -1;
  });
  const allSectionsDone = completedSections.length >= totalSections;
  const practiceDone = JSON.parse(localStorage.getItem('igPracticeDone') || '[]');
  const allTasksDone = practiceDone.filter(Boolean).length >= 5;
  return allSectionsDone && allTasksDone;
}

function renderCertificateSection() {
  const container = document.getElementById('certContainer');
  if (!container) return;

  loadCertData();
  const unlocked = isCertificateUnlocked();

  if (!unlocked && !certGenerated) {
    const progress = loadProgress();
    const totalSections = getTotalSections();
    const sectionIds = typeof sectionData !== 'undefined' && Array.isArray(sectionData)
      ? sectionData.map(s => 's-' + s.id) : [];
    const sectionsDone = progress.completed.filter(function (id) {
      return sectionIds.indexOf(id) !== -1;
    }).length;
    
    // Get practice completion status
    const practiceDone = JSON.parse(localStorage.getItem('igPracticeDone') || '[]');
    const tasksDoneVal = practiceDone.filter(Boolean).length;
    const totalTasks = 5; // Matches the practice tasks count
    const overallPct = Math.min(100, Math.round(((sectionsDone/totalSections) + (tasksDoneVal/totalTasks)) / 2 * 100));

    container.innerHTML = `
      <div class="text-center">
        <span class="badge-premium"> Certificate</span>
        <h2 class="text-3xl sm:text-4xl font-black mt-3">Certificate of Completion</h2>
        <div class="cert-locked-state">
          <div class="cert-lock-icon"></div>
          <p class="text-xl font-bold text-gray-800 mb-2">Certificate Locked</p>
          <p class="text-gray-500">Complete all course sections and all practice tasks to unlock your certificate.</p>
          <div class="cert-progress-status">
            <div class="flex justify-between text-sm mb-2" style="color:rgba(0,0,0,.5)">
              <span> Sections: ${sectionsDone}/${totalSections}</span>
              <span> Tasks: ${tasksDoneVal}/${totalTasks}</span>
            </div>
            <div class="w-full" style="height:6px;background:rgba(0,0,0,.06);border-radius:3px;overflow:hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width:${overallPct}%;background:linear-gradient(90deg,#E1306C,#833AB4);border-radius:3px"></div>
            </div>
            <div style="font-size:12px;color:rgba(0,0,0,.3);margin-top:6px">${overallPct}% complete</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (!certGenerated) {
    container.innerHTML = `
      <div class="text-center">
        <span class="badge-premium"> Certificate</span>
        <h2 class="text-3xl sm:text-4xl font-black mt-3">Congratulations!</h2>
        <div class="cert-generation-screen glass-card p-8 mt-6">
          <div class="cert-celebration-icon"></div>
          <p class="text-xl font-bold text-gray-800 mb-2">You have successfully completed Instagram Mastery.</p>
          <p class="text-gray-500 mb-6">Enter your name to generate your certificate.</p>
          <input type="text" id="certNameInput" class="cert-name-input" placeholder="Enter Your Name" maxlength="50" autocomplete="name">
          <div class="mt-6">
            <button class="cert-btn cert-btn-primary" onclick="handleGenerateCertificate()"> Generate Certificate</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  showCertificatePreview(container);
}

function handleGenerateCertificate() {
  const nameInput = document.getElementById('certNameInput');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    if (nameInput) { nameInput.classList.add('error'); nameInput.focus(); }
    return;
  }
  if (nameInput) nameInput.classList.remove('error');
  certUserName = name;
  certId = generateCertificateId();
  saveCertData(certUserName, certId);
  certGenerated = true;
  renderCertificateSection();
  // Note: Not calling renderSideNav to maintain isolation
  // The main script will handle sidebar updates when needed
}

function showCertificatePreview(container) {
  const shortDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  container.innerHTML = `
    <div class="text-center">
      <span class="badge-premium"> Certificate</span>
      <h2 class="text-3xl sm:text-4xl font-black mt-3">Your Certificate</h2>
    </div>
    <div class="cert-preview-wrapper">
      <div class="certificate" id="certificateDownload">
        <div class="cert-image-wrap">
          <img src="assets/videos/ig_certicate.jpeg" alt="Certificate of Completion" class="cert-bg-img">
          <div class="cert-name-overlay">${escHtml(certUserName)}</div>
          <div class="cert-id-overlay">${certId}</div>
          <div class="cert-date-overlay">${shortDate}</div>
        </div>
      </div>
     </div>
     <div class="cert-actions">
        <button class="cert-btn cert-btn-primary" onclick="downloadCertificateImage()"> Download Certificate</button>
        <button class="cert-btn cert-btn-secondary" onclick="openCertModal()"> View Certificate</button>
        <button class="cert-btn cert-btn-danger" onclick="resetCourse()"> Reset Course</button>
     </div>
   `;
}

// ===== CERTIFICATE MODAL =====
function openCertModal() {
  const existing = document.getElementById('certModalOverlay');
  if (existing) existing.remove();

  const shortDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const overlay = document.createElement('div');
  overlay.className = 'cert-modal-overlay';
  overlay.id = 'certModalOverlay';
  overlay.innerHTML = `
    <div class="cert-modal-content">
      <button class="cert-modal-close" onclick="closeCertModal()" aria-label="Close">&times;</button>
      <div id="certModalBody">
        <div class="certificate" style="margin:0 auto;box-shadow:none;">
          <div class="cert-image-wrap">
            <img src="assets/videos/ig_certicate.jpeg" alt="Certificate of Completion" class="cert-bg-img">
            <div class="cert-name-overlay">${escHtml(certUserName)}</div>
            <div class="cert-id-overlay">${certId}</div>
            <div class="cert-date-overlay">${shortDate}</div>
          </div>
        </div>
      </div>
      <div class="cert-modal-actions">
        <button class="cert-btn cert-btn-primary" onclick="downloadCertificateImage()"> Download Certificate</button>
        <button class="cert-btn cert-btn-secondary" onclick="closeCertModal()"> Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeCertModal();
  });
}

function closeCertModal() {
  const overlay = document.getElementById('certModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

// ===== DOWNLOAD CERTIFICATE VIA PRINT =====
function downloadCertificateImage() {
  const element = document.getElementById('certificateDownload');
  if (!element) return;

  const clone = element.cloneNode(true);
  clone.querySelectorAll('script').forEach(function (s) { s.remove(); });

  var styles = '';
  for (var i = 0; i < document.styleSheets.length; i++) {
    try {
      var rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
      if (rules) {
        for (var j = 0; j < rules.length; j++) {
          styles += rules[j].cssText + '\n';
        }
      }
    } catch (e) {}
  }

  var printWin = window.open('', '_blank', 'width=900,height=700');
  if (!printWin) {
    alert('Please allow popups to download the certificate.');
    return;
  }

  var pageUrl = window.location.href;

  printWin.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8">');
  printWin.document.write('<base href="' + pageUrl + '">');
  printWin.document.write('<title>Instagram Mastery Certificate</title>');
  printWin.document.write('<style>' + styles + '</style>');
  printWin.document.write('<style>');
  printWin.document.write('body { margin: 0; padding: 50px; background: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; box-sizing: border-box; }');
  printWin.document.write('@page { size: landscape; margin: 0; }');
  printWin.document.write('@media print {');
  printWin.document.write('  body { margin: 0; padding: 0; background: white; display: block; }');
  printWin.document.write('  .certificate { box-shadow: none; border: none; margin: 0 auto; }');
  printWin.document.write('  .cert-actions, .cert-btn, .sidebar, .sidebar-panel, .sidebar-floating-btn,');
  printWin.document.write('  .sidebar-drawer-overlay, .section-nav, .section-nav-btn,');
  printWin.document.write('  .mark-complete-btn, .cert-modal-overlay, .cert-modal-actions {');
  printWin.document.write('    display: none !important;');
  printWin.document.write('  }');
  printWin.document.write('}');
  printWin.document.write('</style>');
  printWin.document.write('</head><body>');
  printWin.document.write(clone.outerHTML);
  printWin.document.write('</body></html>');
  printWin.document.close();

  printWin.onload = function () {
    setTimeout(function () { printWin.print(); }, 500);
  };
}

// ===== RESET COURSE =====
function resetCourse() {
  if (!confirm('Are you sure you want to reset your course progress?')) return;

  var emptyProgress = { completed: [], lastSection: null };
  saveProgress(emptyProgress);

  localStorage.removeItem('certificateData');
  certUserName = '';
  certId = '';
  certGenerated = false;

  localStorage.setItem('igPracticeDone', JSON.stringify([false, false, false, false, false]));

  if (typeof resetPractice === 'function') resetPractice();

  // Reset all "Mark as Completed" section buttons back to default state
  document.querySelectorAll('.mark-complete-btn.done').forEach(function (btn) {
    btn.className = 'mark-complete-btn';
    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Mark as Completed';
  });

  // Re-render certificate section to show locked state
  renderCertificateSection();

  // Update all progress-dependent UI (sidebar, top bar, resume banner)
  if (typeof updateProgress === 'function') {
    updateProgress();
  } else if (typeof renderSideNav === 'function') {
    renderSideNav();
  }
}

