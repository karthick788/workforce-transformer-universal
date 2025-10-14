/* frontend_interactions.js
   Lightweight interactions:
   - Card tilt on mousemove
   - Tooltip keyboard support
   - Animated progress fill
   - Modal utility
   - Animated AI score counter
*/

(function(){
    // Card tilt
    function bindTilt(selector) {
      document.querySelectorAll(selector).forEach(el=>{
        el.classList.add('tilt');
        el.addEventListener('mousemove', (e)=>{
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - rect.left - rect.width/2;
          const dy = e.clientY - rect.top - rect.height/2;
          const tiltX = (dy/rect.height)*6; // degrees
          const tiltY = -(dx/rect.width)*6;
          el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        });
        el.addEventListener('mouseleave', ()=> el.style.transform = '');
      });
    }
  
    // Tooltip keyboard accessible
    function initTooltips() {
      document.querySelectorAll('.tooltip').forEach(t=>{
        t.setAttribute('tabindex','0');
      });
    }
  
    // Animate progress bars based on data-progress attribute
    function animateProgress() {
      document.querySelectorAll('.progress-bar').forEach(pb=>{
        const val = pb.getAttribute('data-progress') || pb.dataset.progress;
        const inner = pb.querySelector('i');
        if (inner && val) {
          setTimeout(()=> inner.style.width = `${val}%`, 300);
        }
      });
    }
  
    // Modal utility
    function openModal(htmlContent) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${htmlContent}<div style="text-align:right;margin-top:16px;"><button class="btn--primary close-modal">Close</button></div></div>`;
      document.body.appendChild(backdrop);
      backdrop.querySelector('.close-modal').focus();
      backdrop.addEventListener('click', (e)=> {
        if (e.target === backdrop || e.target.classList.contains('close-modal')) backdrop.remove();
      });
    }
  
    // Animated AI score
    function animateAIScore(selector, target) {
      const el = document.querySelector(selector);
      if (!el) return;
      let start = 0;
      const dur = 1200;
      const step = 16;
      const increment = target / (dur/step);
      const iv = setInterval(()=>{
        start = Math.min(target, start + increment);
        el.textContent = Math.round(start);
        if (start >= target) clearInterval(iv);
      }, step);
    }
  
    // Wire interactions
    document.addEventListener('DOMContentLoaded', ()=>{
      bindTilt('.role-item, .card');
      initTooltips();
      animateProgress();
      const aiEl = document.querySelector('.ai-score .score-num');
      if (aiEl && aiEl.dataset.target) {
        animateAIScore('.ai-score .score-num', Number(aiEl.dataset.target));
      }
  
      // data-action example: detail button -> show modal
      document.body.addEventListener('click', (e)=>{
        const t = e.target;
        if (t.matches('[data-action="show-role-detail"]')) {
          const role = t.closest('.role-item')?.querySelector('.role-name')?.textContent || 'Role';
          openModal(`<h3 style="margin:0 0 8px;">${role}</h3><p style="color:var(--muted)">This modal can show training plans, suggested courses, and links. Replace with dynamic content.</p>`);
        }
      });
    });
  })();
  