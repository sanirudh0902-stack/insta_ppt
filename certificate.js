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
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const shortDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  container.innerHTML = `
    <div class="text-center">
      <span class="badge-premium"> Certificate</span>
      <h2 class="text-3xl sm:text-4xl font-black mt-3">Your Certificate</h2>
    </div>
    <div class="cert-preview-wrapper">
      <div class="certificate" id="certificateDownload">
        <div class="cert-inner-border"></div>
        <div class="cert-corner cert-corner-tl"></div>
        <div class="cert-corner cert-corner-tr"></div>
        <div class="cert-corner cert-corner-bl"></div>
        <div class="cert-corner cert-corner-br"></div>

        <div class="cert-bg-elem cert-bg-insta-left">
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
            <rect x="5" y="5" width="90" height="90" rx="22" stroke="#E1306C" stroke-width="1.2"/>
            <circle cx="50" cy="50" r="22" stroke="#E1306C" stroke-width="1.2"/>
            <circle cx="76" cy="24" r="6" fill="#E1306C"/>
          </svg>
        </div>
        <div class="cert-bg-elem cert-bg-heart">
          <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
            <path d="M20 34s-14-8-14-18c0-5 4-9 9-9 3 0 5 1.5 5 1.5s2-1.5 5-1.5c5 0 9 4 9 9 0 10-14 18-14 18z" stroke="#E1306C" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="cert-bg-elem cert-bg-sparkle cert-bg-sparkle-1"></div>
        <div class="cert-bg-elem cert-bg-sparkle cert-bg-sparkle-2"></div>

        <div class="cert-header">
          <div class="cert-header-left">
            <div class="cert-habuild-circle">
              <span class="cert-habuild-icon">H</span>
            </div>
          </div>
          <div class="cert-header-center">
            <div class="cert-insta-row">
              <span class="cert-insta-icon-large">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGrad)" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="5" stroke="url(#igGrad)" stroke-width="1.8"/>
                  <circle cx="18" cy="6" r="1.5" fill="url(#igGrad)"/>
                  <defs><linearGradient id="igGrad" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#F77737"/><stop offset="50%" stop-color="#E1306C"/><stop offset="100%" stop-color="#833AB4"/></linearGradient></defs>
                </svg>
              </span>
              <span class="cert-insta-title">Instagram Mastery</span>
            </div>
            <div class="cert-insta-sub">Learn \u2022 Create \u2022 Share \u2022 Grow</div>
          </div>
          <div class="cert-header-right">
            <div class="cert-heart-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M12 21s-8-5-8-12c0-3.5 2.8-6 6-6 2 0 4 1 4 1s2-1 4-1c3.2 0 6 2.5 6 6 0 7-8 12-8 12z" fill="#FF6B9D" stroke="#E1306C" stroke-width="1"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="cert-trophy-wrap">
          <span class="cert-laurel">
            <svg viewBox="0 0 50 30" width="100%" height="100%" fill="none">
              <path d="M25 30c-4-6-8-16-4-24 0 0 4 10 8 14s6 6 6 6-4 4-10 4z" fill="#c9a84c" opacity=".6"/>
              <path d="M25 30c4-6 8-16 4-24 0 0-4 10-8 14s-6 6-6 6 4 4 10 4z" fill="#c9a84c" opacity=".4"/>
              <path d="M25 30c-2-4-5-12-2-20l1 3c-1 6 1 12 1 12s2 3 0 5z" fill="#c9a84c" opacity=".7"/>
              <path d="M25 30c2-4 5-12 2-20l-1 3c1 6-1 12-1 12s-2 3 0 5z" fill="#c9a84c" opacity=".5"/>
            </svg>
          </span>
          <span class="cert-trophy-icon">\uD83C\uDFC6</span>
          <span class="cert-laurel cert-laurel-right">
            <svg viewBox="0 0 50 30" width="100%" height="100%" fill="none">
              <path d="M25 30c-4-6-8-16-4-24 0 0 4 10 8 14s6 6 6 6-4 4-10 4z" fill="#c9a84c" opacity=".6"/>
              <path d="M25 30c4-6 8-16 4-24 0 0-4 10-8 14s-6 6-6 6 4 4 10 4z" fill="#c9a84c" opacity=".4"/>
              <path d="M25 30c-2-4-5-12-2-20l1 3c-1 6 1 12 1 12s2 3 0 5z" fill="#c9a84c" opacity=".7"/>
              <path d="M25 30c2-4 5-12 2-20l-1 3c1 6-1 12-1 12s-2 3 0 5z" fill="#c9a84c" opacity=".5"/>
            </svg>
          </span>
        </div>

        <div class="cert-gold-divider-wrap">
          <div class="cert-gold-line"></div>
          <span class="cert-gold-diamond">\u25C6</span>
          <div class="cert-gold-line"></div>
        </div>

        <div class="cert-body">
          <div class="cert-body-title">CERTIFICATE OF COMPLETION</div>
          <div class="cert-body-awarded-by">This certificate is proudly awarded by</div>
          <div class="cert-body-org">HABUILD</div>
          <div class="cert-ribbon">
            <div class="cert-ribbon-wing"></div>
            <span class="cert-ribbon-center">to</span>
            <div class="cert-ribbon-wing cert-ribbon-wing-right"></div>
          </div>
          <div class="cert-body-name">${escHtml(certUserName)}</div>
          <div class="cert-name-divider"></div>
          <div class="cert-body-desc">For successfully completing the <span class="cert-desc-highlight">Instagram Mastery Learning Program</span> and all required practice activities.</div>
        </div>

        <div class="cert-features">
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M16 8h.01"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Instagram Basics</div>
              <div class="cert-feature-sublabel">Account Setup &amp; Profile</div>
            </div>
          </div>
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Stories</div>
              <div class="cert-feature-sublabel">Create &amp; Share Stories</div>
            </div>
          </div>
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Posts</div>
              <div class="cert-feature-sublabel">Create &amp; Share Posts</div>
            </div>
          </div>
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Reels</div>
              <div class="cert-feature-sublabel">Create &amp; Share Reels</div>
            </div>
          </div>
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Collaboration Tags</div>
              <div class="cert-feature-sublabel">Connect &amp; Collaborate</div>
            </div>
          </div>
          <div class="cert-feature-item">
            <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></span>
            <div class="cert-feature-text">
              <div class="cert-feature-label">Privacy &amp; Settings</div>
              <div class="cert-feature-sublabel">Manage &amp; Secure</div>
            </div>
          </div>
        </div>

        <div class="cert-footer">
          <div class="cert-footer-col">
            <div class="cert-footer-icon">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#E1306C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="14" rx="2"/><path d="M3 8h14"/><path d="M7 2v3"/><path d="M13 2v3"/></svg>
            </div>
            <div class="cert-footer-label">Completion Date</div>
            <div class="cert-footer-value">${shortDate}</div>
          </div>
          <div class="cert-footer-col">
            <div class="cert-footer-icon">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#E1306C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="16" height="14" rx="2"/><circle cx="10" cy="9" r="2"/><path d="M5 17c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>
            </div>
            <div class="cert-footer-label">Certificate ID</div>
            <div class="cert-footer-value id">${certId}</div>
          </div>
          <div class="cert-footer-col cert-footer-seal-col">
            <div class="cert-gold-medal">
              <div class="cert-medal-circle">
                <span class="cert-medal-star">\u2605</span>
              </div>
              <div class="cert-medal-ribbon cert-medal-ribbon-l"></div>
              <div class="cert-medal-ribbon cert-medal-ribbon-r"></div>
            </div>
          </div>
          <div class="cert-footer-col cert-footer-sig-col">
            <div class="cert-sig-line"></div>
            <div class="cert-sig-team">Team Habuild</div>
            <div class="cert-sig-name">Habuild</div>
            <div class="cert-sig-tagline">Empowering Lives, Building Better Tomorrows</div>
          </div>
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
          <div class="cert-inner-border"></div>
          <div class="cert-corner cert-corner-tl"></div>
          <div class="cert-corner cert-corner-tr"></div>
          <div class="cert-corner cert-corner-bl"></div>
          <div class="cert-corner cert-corner-br"></div>

          <div class="cert-bg-elem cert-bg-insta-left">
            <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
              <rect x="5" y="5" width="90" height="90" rx="22" stroke="#E1306C" stroke-width="1.2"/>
              <circle cx="50" cy="50" r="22" stroke="#E1306C" stroke-width="1.2"/>
              <circle cx="76" cy="24" r="6" fill="#E1306C"/>
            </svg>
          </div>
          <div class="cert-bg-elem cert-bg-heart">
            <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
              <path d="M20 34s-14-8-14-18c0-5 4-9 9-9 3 0 5 1.5 5 1.5s2-1.5 5-1.5c5 0 9 4 9 9 0 10-14 18-14 18z" stroke="#E1306C" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="cert-bg-elem cert-bg-sparkle cert-bg-sparkle-1"></div>
          <div class="cert-bg-elem cert-bg-sparkle cert-bg-sparkle-2"></div>

          <div class="cert-header">
            <div class="cert-header-left">
              <div class="cert-habuild-circle">
                <span class="cert-habuild-icon">H</span>
              </div>
            </div>
            <div class="cert-header-center">
              <div class="cert-insta-row">
                <span class="cert-insta-icon-large">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGrad2)" stroke-width="1.8"/>
                    <circle cx="12" cy="12" r="5" stroke="url(#igGrad2)" stroke-width="1.8"/>
                    <circle cx="18" cy="6" r="1.5" fill="url(#igGrad2)"/>
                    <defs><linearGradient id="igGrad2" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#F77737"/><stop offset="50%" stop-color="#E1306C"/><stop offset="100%" stop-color="#833AB4"/></linearGradient></defs>
                  </svg>
                </span>
                <span class="cert-insta-title">Instagram Mastery</span>
              </div>
              <div class="cert-insta-sub">Learn \u2022 Create \u2022 Share \u2022 Grow</div>
            </div>
            <div class="cert-header-right">
              <div class="cert-heart-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <path d="M12 21s-8-5-8-12c0-3.5 2.8-6 6-6 2 0 4 1 4 1s2-1 4-1c3.2 0 6 2.5 6 6 0 7-8 12-8 12z" fill="#FF6B9D" stroke="#E1306C" stroke-width="1"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="cert-trophy-wrap">
            <span class="cert-laurel">
              <svg viewBox="0 0 50 30" width="100%" height="100%" fill="none">
                <path d="M25 30c-4-6-8-16-4-24 0 0 4 10 8 14s6 6 6 6-4 4-10 4z" fill="#c9a84c" opacity=".6"/>
                <path d="M25 30c4-6 8-16 4-24 0 0-4 10-8 14s-6 6-6 6 4 4 10 4z" fill="#c9a84c" opacity=".4"/>
                <path d="M25 30c-2-4-5-12-2-20l1 3c-1 6 1 12 1 12s2 3 0 5z" fill="#c9a84c" opacity=".7"/>
                <path d="M25 30c2-4 5-12 2-20l-1 3c1 6-1 12-1 12s-2 3 0 5z" fill="#c9a84c" opacity=".5"/>
              </svg>
            </span>
            <span class="cert-trophy-icon">\uD83C\uDFC6</span>
            <span class="cert-laurel cert-laurel-right">
              <svg viewBox="0 0 50 30" width="100%" height="100%" fill="none">
                <path d="M25 30c-4-6-8-16-4-24 0 0 4 10 8 14s6 6 6 6-4 4-10 4z" fill="#c9a84c" opacity=".6"/>
                <path d="M25 30c4-6 8-16 4-24 0 0-4 10-8 14s-6 6-6 6 4 4 10 4z" fill="#c9a84c" opacity=".4"/>
                <path d="M25 30c-2-4-5-12-2-20l1 3c-1 6 1 12 1 12s2 3 0 5z" fill="#c9a84c" opacity=".7"/>
                <path d="M25 30c2-4 5-12 2-20l-1 3c1 6-1 12-1 12s-2 3 0 5z" fill="#c9a84c" opacity=".5"/>
              </svg>
            </span>
          </div>

          <div class="cert-gold-divider-wrap">
            <div class="cert-gold-line"></div>
            <span class="cert-gold-diamond">\u25C6</span>
            <div class="cert-gold-line"></div>
          </div>

          <div class="cert-body">
            <div class="cert-body-title">CERTIFICATE OF COMPLETION</div>
            <div class="cert-body-awarded-by">This certificate is proudly awarded by</div>
            <div class="cert-body-org">HABUILD</div>
            <div class="cert-ribbon">
              <div class="cert-ribbon-wing"></div>
              <span class="cert-ribbon-center">to</span>
              <div class="cert-ribbon-wing cert-ribbon-wing-right"></div>
            </div>
            <div class="cert-body-name">${escHtml(certUserName)}</div>
            <div class="cert-name-divider"></div>
            <div class="cert-body-desc">For successfully completing the <span class="cert-desc-highlight">Instagram Mastery Learning Program</span> and all required practice activities.</div>
          </div>

          <div class="cert-features">
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M16 8h.01"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Instagram Basics</div>
                <div class="cert-feature-sublabel">Account Setup &amp; Profile</div>
              </div>
            </div>
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Stories</div>
                <div class="cert-feature-sublabel">Create &amp; Share Stories</div>
              </div>
            </div>
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Posts</div>
                <div class="cert-feature-sublabel">Create &amp; Share Posts</div>
              </div>
            </div>
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Reels</div>
                <div class="cert-feature-sublabel">Create &amp; Share Reels</div>
              </div>
            </div>
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Collaboration Tags</div>
                <div class="cert-feature-sublabel">Connect &amp; Collaborate</div>
              </div>
            </div>
            <div class="cert-feature-item">
              <span class="cert-feature-icon-circle"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></span>
              <div class="cert-feature-text">
                <div class="cert-feature-label">Privacy &amp; Settings</div>
                <div class="cert-feature-sublabel">Manage &amp; Secure</div>
              </div>
            </div>
          </div>

          <div class="cert-footer">
            <div class="cert-footer-col">
              <div class="cert-footer-icon">
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#E1306C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="14" rx="2"/><path d="M3 8h14"/><path d="M7 2v3"/><path d="M13 2v3"/></svg>
              </div>
              <div class="cert-footer-label">Completion Date</div>
              <div class="cert-footer-value">${shortDate}</div>
            </div>
            <div class="cert-footer-col">
              <div class="cert-footer-icon">
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#E1306C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="16" height="14" rx="2"/><circle cx="10" cy="9" r="2"/><path d="M5 17c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>
              </div>
              <div class="cert-footer-label">Certificate ID</div>
              <div class="cert-footer-value id">${certId}</div>
            </div>
            <div class="cert-footer-col cert-footer-seal-col">
              <div class="cert-gold-medal">
                <div class="cert-medal-circle">
                  <span class="cert-medal-star">\u2605</span>
                </div>
                <div class="cert-medal-ribbon cert-medal-ribbon-l"></div>
                <div class="cert-medal-ribbon cert-medal-ribbon-r"></div>
              </div>
            </div>
            <div class="cert-footer-col cert-footer-sig-col">
              <div class="cert-sig-line"></div>
              <div class="cert-sig-team">Team Habuild</div>
              <div class="cert-sig-name">Habuild</div>
              <div class="cert-sig-tagline">Empowering Lives, Building Better Tomorrows</div>
            </div>
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

  const shortDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

  printWin.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8">');
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

