/**
 * ExamBuddy — Interactive Script & Tools
 * Academic Resources & Student Tools
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation & Header Scroll State
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const navOverlayMask = document.getElementById('navOverlayMask');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header?.classList.add('scrolled');
      backToTopBtn?.classList.add('visible');
    } else {
      header?.classList.remove('scrolled');
      backToTopBtn?.classList.remove('visible');
    }

    // Show sticky mobile download bar after scrolling past hero
    if (scrollY > 350) {
      mobileStickyBar?.classList.add('visible');
    } else {
      mobileStickyBar?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Menu Toggle & Overlay Mask
  function toggleMobileMenu() {
    navLinks?.classList.toggle('open');
    navOverlayMask?.classList.toggle('active');
    const isOpen = navLinks?.classList.contains('open');
    if (mobileToggle) mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    mobileToggle?.setAttribute('aria-expanded', String(isOpen));
  }

  mobileToggle?.addEventListener('click', toggleMobileMenu);
  navOverlayMask?.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      navOverlayMask?.classList.remove('active');
      if (mobileToggle) mobileToggle.innerHTML = '☰';
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // 1a. Rotating app preview
  const appShowcase = document.querySelector('[data-app-showcase]');
  if (appShowcase) {
    const appSlides = [...appShowcase.querySelectorAll('[data-app-slide]')];
    const showcaseDots = [...appShowcase.querySelectorAll('[data-showcase-dot]')];
    const showcaseStatus = appShowcase.querySelector('.showcase-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeSlide = 0;
    let showcaseTimer;

    function showAppSlide(index) {
      activeSlide = (index + appSlides.length) % appSlides.length;
      appSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.hidden = !isActive;
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      showcaseDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', String(isActive));
      });
      if (showcaseStatus) {
        showcaseStatus.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(appSlides.length).padStart(2, '0')}`;
      }
    }

    function stopShowcaseRotation() {
      window.clearInterval(showcaseTimer);
      showcaseTimer = undefined;
    }

    function startShowcaseRotation() {
      stopShowcaseRotation();
      if (reducedMotion || document.hidden || appShowcase.matches(':hover') || appShowcase.contains(document.activeElement)) return;
      showcaseTimer = window.setInterval(() => showAppSlide(activeSlide + 1), 5000);
    }

    appShowcase.querySelector('[data-showcase-prev]')?.addEventListener('click', () => {
      showAppSlide(activeSlide - 1);
      startShowcaseRotation();
    });
    appShowcase.querySelector('[data-showcase-next]')?.addEventListener('click', () => {
      showAppSlide(activeSlide + 1);
      startShowcaseRotation();
    });
    showcaseDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showAppSlide(index);
        startShowcaseRotation();
      });
    });
    appShowcase.addEventListener('pointerenter', stopShowcaseRotation);
    appShowcase.addEventListener('pointerleave', startShowcaseRotation);
    appShowcase.addEventListener('focusin', stopShowcaseRotation);
    appShowcase.addEventListener('focusout', event => {
      if (!appShowcase.contains(event.relatedTarget)) startShowcaseRotation();
    });
    document.addEventListener('visibilitychange', startShowcaseRotation);
    startShowcaseRotation();
  }

  // 2. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        if (answerDiv) answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (answerDiv) answerDiv.style.maxHeight = null;
      }
    });
  });

  // 3. GGU CBCS CGPA / SGPA Calculator
  const gradePoints = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0,
    'Ab': 0
  };

  const subjectTableBody = document.getElementById('subjectTableBody');
  const addSubjectBtn = document.getElementById('addSubjectBtn');
  const calculateSgpaBtn = document.getElementById('calculateSgpaBtn');
  const resetCalcBtn = document.getElementById('resetCalcBtn');
  const sgpaResultDisplay = document.getElementById('sgpaResult');
  const totalCreditsDisplay = document.getElementById('totalCreditsDisplay');

  let subjectCounter = 4;

  // Add new subject row
  addSubjectBtn?.addEventListener('click', () => {
    subjectCounter++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="input-control" placeholder="Subject ${subjectCounter}" value="Subject ${subjectCounter}"></td>
      <td>
        <select class="input-control subject-credit">
          <option value="4" selected>4 Credits</option>
          <option value="3">3 Credits</option>
          <option value="2">2 Credits (Lab)</option>
          <option value="1">1 Credit</option>
          <option value="5">5 Credits</option>
          <option value="6">6 Credits</option>
        </select>
      </td>
      <td>
        <select class="input-control subject-grade">
          <option value="O">O (10 - Outstanding)</option>
          <option value="A+" selected>A+ (9 - Excellent)</option>
          <option value="A">A (8 - Very Good)</option>
          <option value="B+">B+ (7 - Good)</option>
          <option value="B">B (6 - Above Avg)</option>
          <option value="C">C (5 - Average)</option>
          <option value="P">P (4 - Pass)</option>
          <option value="F">F (0 - Fail)</option>
        </select>
      </td>
      <td>
        <button type="button" class="btn-remove-row" title="Remove Subject">✕</button>
      </td>
    `;
    subjectTableBody?.appendChild(tr);
    attachRemoveListener(tr.querySelector('.btn-remove-row'));
  });

  function attachRemoveListener(btn) {
    btn?.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (document.querySelectorAll('#subjectTableBody tr').length > 1) {
        row.remove();
        calculateSGPA();
      } else {
        showToast('At least 1 subject is required for calculation!');
      }
    });
  }

  document.querySelectorAll('.btn-remove-row').forEach(attachRemoveListener);

  function calculateSGPA() {
    const creditSelects = document.querySelectorAll('.subject-credit');
    const gradeSelects = document.querySelectorAll('.subject-grade');

    let totalCredits = 0;
    let weightedPoints = 0;

    creditSelects.forEach((credSel, idx) => {
      const credits = parseFloat(credSel.value) || 0;
      const grade = gradeSelects[idx].value;
      const point = gradePoints[grade] !== undefined ? gradePoints[grade] : 0;

      totalCredits += credits;
      weightedPoints += (credits * point);
    });

    if (totalCredits > 0) {
      const sgpa = (weightedPoints / totalCredits).toFixed(2);
      if (sgpaResultDisplay) sgpaResultDisplay.textContent = sgpa;
      if (totalCreditsDisplay) totalCreditsDisplay.textContent = `${totalCredits} Credits`;
    } else {
      if (sgpaResultDisplay) sgpaResultDisplay.textContent = '0.00';
      if (totalCreditsDisplay) totalCreditsDisplay.textContent = '0 Credits';
    }
  }

  calculateSgpaBtn?.addEventListener('click', calculateSGPA);

  resetCalcBtn?.addEventListener('click', () => {
    if (sgpaResultDisplay) sgpaResultDisplay.textContent = '0.00';
    if (totalCreditsDisplay) totalCreditsDisplay.textContent = '0 Credits';
  });

  // 4. Attendance Calculator & Simulator
  const totalClassesInput = document.getElementById('totalClasses');
  const attendedClassesInput = document.getElementById('attendedClasses');
  const calculateAttBtn = document.getElementById('calculateAttBtn');
  const attPercentDisplay = document.getElementById('attPercentDisplay');
  const attBadge = document.getElementById('attBadge');
  const attAdvice = document.getElementById('attAdvice');

  function calculateAttendance() {
    const total = parseInt(totalClassesInput?.value, 10);
    const attended = parseInt(attendedClassesInput?.value, 10);

    if (isNaN(total) || isNaN(attended) || total <= 0) {
      showToast('Please enter valid class numbers!');
      return;
    }

    if (attended > total) {
      showToast('Attended classes cannot exceed total classes!');
      return;
    }

    const percentage = ((attended / total) * 100).toFixed(1);
    if (attPercentDisplay) attPercentDisplay.textContent = `${percentage}%`;

    if (percentage >= 75) {
      if (attBadge) {
        attBadge.className = 'att-status-badge safe';
        attBadge.textContent = '✓ At or above 75% estimate';
      }
      // Calculate bunkable classes: (attended / (total + x)) >= 0.75 => x <= (attended - 0.75*total)/0.75
      const canBunk = Math.floor((attended - 0.75 * total) / 0.75);
      if (attAdvice) {
        if (canBunk > 0) {
          attAdvice.innerHTML = `🎉 You can safely miss <strong>${canBunk}</strong> upcoming class(es) while staying at or above 75%.`;
        } else {
          attAdvice.innerHTML = `⚠️ Your attendance is right at the 75% edge. Do not miss any upcoming classes!`;
        }
      }
    } else {
      if (attBadge) {
        attBadge.className = 'att-status-badge danger';
        attBadge.textContent = '⚠️ Shortage Warning (<75%)';
      }
      // Calculate required classes: (attended + y) / (total + y) >= 0.75 => y >= (0.75*total - attended)/0.25
      const needToAttend = Math.ceil((0.75 * total - attended) / 0.25);
      if (attAdvice) {
        attAdvice.innerHTML = `🚨 You must attend the next <strong>${needToAttend}</strong> consecutive class(es) without absence to reach 75%.`;
      }
    }
  }

  calculateAttBtn?.addEventListener('click', calculateAttendance);

  // 5a. Selected Candidates Modal
  const selectedCandidatesModal = document.getElementById('selectedCandidatesModal');
  const openSelectedCandidatesBtn = document.getElementById('openSelectedCandidates');
  const closeSelectedCandidatesBtn = document.getElementById('closeSelectedCandidates');
  let selectedCandidatesTrigger;

  function closeSelectedCandidatesModal() {
    if (!selectedCandidatesModal?.classList.contains('active')) return;
    selectedCandidatesModal.classList.remove('active');
    selectedCandidatesModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    selectedCandidatesTrigger?.focus();
  }

  openSelectedCandidatesBtn?.addEventListener('click', () => {
    if (!selectedCandidatesModal) return;
    selectedCandidatesTrigger = openSelectedCandidatesBtn;
    selectedCandidatesModal.classList.add('active');
    selectedCandidatesModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => closeSelectedCandidatesBtn?.focus());
  });

  closeSelectedCandidatesBtn?.addEventListener('click', closeSelectedCandidatesModal);

  selectedCandidatesModal?.addEventListener('click', event => {
    if (event.target === selectedCandidatesModal) closeSelectedCandidatesModal();
  });

  selectedCandidatesModal?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSelectedCandidatesModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...selectedCandidatesModal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // 5. Download Modal
  const downloadModal = document.getElementById('downloadModal');
  const openDownloadBtns = document.querySelectorAll('.btn-open-download');
  const closeDownloadBtn = document.getElementById('closeDownloadModal');

  openDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadModal?.classList.add('active');
    });
  });

  closeDownloadBtn?.addEventListener('click', () => {
    downloadModal?.classList.remove('active');
  });

  downloadModal?.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
      downloadModal.classList.remove('active');
    }
  });

  // 6. Copy Support Email
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'office@exambuddy.info';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast(`Support email: ${email}`);
      });
    });
  });

  // 7. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      showToast('Thank you! Your message has been sent to ExamBuddy support.');
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }, 1000);
  });

  // 8. Global Toast Notification Helper
  function showToast(msg) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span> ${msg}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
});
