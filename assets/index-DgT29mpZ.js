(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const P="modulepreload",E=function(e){return"/"+e},h={},L=function(t,o,c){let n=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(o.map(s=>{if(s=E(s),s in h)return;h[s]=!0;const d=s.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${f}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":P,d||(l.as="script"),l.crossOrigin="",l.href=s,i&&l.setAttribute("nonce",i),document.head.appendChild(l),d)return new Promise((D,k)=>{l.addEventListener("load",D),l.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${s}`)))})}))}function r(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return n.then(a=>{for(const i of a||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let u="",p="",m=!1;function b(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function M(){return"IGM-"+Math.random().toString(36).substr(2,9).toUpperCase()}function C(){try{const e=localStorage.getItem("igMasteryProgress");return e?JSON.parse(e):{completed:[],lastSection:null}}catch{return{completed:[],lastSection:null}}}function I(e){try{localStorage.setItem("igMasteryProgress",JSON.stringify(e))}catch{}}function w(){return typeof sectionData<"u"&&Array.isArray(sectionData)?[...new Set(sectionData.map(e=>e.id))].length:0}function S(){const e=localStorage.getItem("certificateData");if(e){const t=JSON.parse(e);u=t.name||"",p=t.id||"",m=t.generated||!1}}function N(e,t){localStorage.setItem("certificateData",JSON.stringify({name:e,id:t,generated:!0}))}function O(){const e=C(),t=w(),o=typeof sectionData<"u"&&Array.isArray(sectionData)?sectionData.map(i=>"s-"+i.id):[],n=e.completed.filter(function(i){return o.indexOf(i)!==-1}).length>=t,a=JSON.parse(localStorage.getItem("igPracticeDone")||"[]").filter(Boolean).length>=5;return n&&a}function g(){const e=document.getElementById("certContainer");if(!e)return;if(S(),!O()&&!m){const o=C(),c=w(),n=typeof sectionData<"u"&&Array.isArray(sectionData)?sectionData.map(f=>"s-"+f.id):[],r=o.completed.filter(function(f){return n.indexOf(f)!==-1}).length,i=JSON.parse(localStorage.getItem("igPracticeDone")||"[]").filter(Boolean).length,s=5,d=Math.min(100,Math.round((r/c+i/s)/2*100));e.innerHTML=`
      <div class="text-center">
        <span class="badge-premium"> Certificate</span>
        <h2 class="text-3xl sm:text-4xl font-black mt-3">Certificate of Completion</h2>
        <div class="cert-locked-state">
          <div class="cert-lock-icon"></div>
          <p class="text-xl font-bold text-gray-800 mb-2">Certificate Locked</p>
          <p class="text-gray-500">Complete all course sections and all practice tasks to unlock your certificate.</p>
          <div class="cert-progress-status">
            <div class="flex justify-between text-sm mb-2" style="color:rgba(0,0,0,.5)">
              <span> Sections: ${r}/${c}</span>
              <span> Tasks: ${i}/${s}</span>
            </div>
            <div class="w-full" style="height:6px;background:rgba(0,0,0,.06);border-radius:3px;overflow:hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width:${d}%;background:linear-gradient(90deg,#E1306C,#833AB4);border-radius:3px"></div>
            </div>
            <div style="font-size:12px;color:rgba(0,0,0,.3);margin-top:6px">${d}% complete</div>
          </div>
        </div>
      </div>
    `;return}if(!m){e.innerHTML=`
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
    `;return}J(e)}function T(){const e=document.getElementById("certNameInput"),t=e?e.value.trim():"";if(!t){e&&(e.classList.add("error"),e.focus());return}e&&e.classList.remove("error"),u=t,p=M(),N(u,p),m=!0,g()}function v(){var e=document.querySelector(".certificate .cert-name");if(e){var t=e.clientWidth,o=(e.textContent||"").trim().length;if(!(o<14)){var c=parseFloat(window.getComputedStyle(e).fontSize),n=Math.min(1,t*.85/(o*c*.6));n<1&&(e.style.fontSize=c*n+"px")}}}function A(e){var t=b(e),o=`
    <div class="certificate" id="certificateDownload">
      <img src="/assets/videos/certificate-bg.jpg" alt="Certificate of Completion" class="cert-bg-img">
      <div class="cert-overlays">
        <div class="cert-name">${t}</div>
      </div>
    </div>`;return o}function J(e){new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),e.innerHTML=`
    <div class="text-center">
      <span class="badge-premium"> Certificate</span>
      <h2 class="text-3xl sm:text-4xl font-black mt-3">Your Certificate</h2>
    </div>
    <div class="cert-preview-wrapper">
      ${A(u)}
     </div>
     <div class="cert-actions">
         <button class="cert-btn cert-btn-primary" onclick="downloadCertificatePng()"> Download PNG</button>
         <button class="cert-btn cert-btn-secondary" onclick="downloadCertificateJpg()"> Download JPG</button>
         <button class="cert-btn cert-btn-secondary" onclick="openCertModal()"> View Certificate</button>
         <button class="cert-btn cert-btn-danger" onclick="resetCourse()"> Reset Course</button>
      </div>
    `,setTimeout(v,50)}function B(){const e=document.getElementById("certModalOverlay");e&&e.remove(),new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});const t=document.createElement("div");t.className="cert-modal-overlay",t.id="certModalOverlay",t.innerHTML=`
    <div class="cert-modal-content">
      <button class="cert-modal-close" onclick="closeCertModal()" aria-label="Close">&times;</button>
      <div id="certModalBody">
        <div class="certificate" style="margin:0 auto;box-shadow:none;">
          <img src="/assets/videos/certificate-bg.jpg" alt="Certificate of Completion" class="cert-bg-img">
          <div class="cert-overlays">
            <div class="cert-name">${b(u)}</div>
          </div>
        </div>
      </div>
      <div class="cert-modal-actions">
         <button class="cert-btn cert-btn-primary" onclick="downloadCertificatePng()"> Download PNG</button>
         <button class="cert-btn cert-btn-secondary" onclick="downloadCertificateJpg()"> Download JPG</button>
         <button class="cert-btn cert-btn-secondary" onclick="closeCertModal()"> Close</button>
       </div>
    </div>
  `,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("active"),setTimeout(v,100)}),t.addEventListener("click",function(o){o.target===t&&x()})}function x(){const e=document.getElementById("certModalOverlay");e&&(e.classList.remove("active"),setTimeout(()=>e.remove(),300))}function y(e){const t=document.getElementById("certificateDownload");t&&(v(),L(()=>import("./html2canvas.esm-CBrSDip1.js"),[]).then(function(o){return(o.default||o)(t,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,allowTaint:!1,width:t.scrollWidth,height:t.scrollHeight,onclone:function(n){const r=n.getElementById("certificateDownload");r&&(r.style.width="850px",r.style.maxWidth="850px",r.style.margin="0 auto")}})}).then(function(o){const c=e==="jpg"?"image/jpeg":"image/png",n=o.toDataURL(c,1),r=document.createElement("a");r.href=n,r.download="certificate."+(e==="jpg"?"jpg":"png"),document.body.appendChild(r),r.click(),document.body.removeChild(r)}).catch(function(o){console.error("Certificate export failed:",o),alert("Certificate export failed. Please try again.")}))}function $(){y("png")}function j(){y("jpg")}function G(){y("png")}window.downloadCertificate=$;window.downloadCertificateJpg=j;window.downloadCertificatePng=G;window.loadCertData=S;window.renderCertificateSection=g;window.handleGenerateCertificate=T;window.openCertModal=B;window.closeCertModal=x;window.resetCourse=U;function U(){if(confirm("Are you sure you want to reset your course progress?")){var e={completed:[],lastSection:null};I(e),localStorage.removeItem("certificateData"),u="",p="",m=!1,localStorage.setItem("igPracticeDone",JSON.stringify([!1,!1,!1,!1,!1])),typeof resetPractice=="function"&&resetPractice(),document.querySelectorAll(".mark-complete-btn.done").forEach(function(t){t.className="mark-complete-btn",t.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Mark as Completed'}),g(),typeof updateProgress=="function"?updateProgress():typeof renderSideNav=="function"&&renderSideNav()}}
