/**
 * Home Generator & Inverter Service Center - Core Global Logic
 * Features:
 * - Branded Preloader
 * - Compact Fixed Header & Scroll Shadow
 * - Click-Only Home Dropdown (Hover disabled)
 * - Mobile Navigation Drawer & Accordion
 * - Dark Mode (#000000 base) with LocalStorage
 * - RTL/LTR Direction Switching with LocalStorage
 * - Scroll to Top Button
 * - Auth Modal (Login / Register)
 * - Active Link Detection
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const preloader = document.getElementById('preloader');
  const siteHeader = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const desktopDropdown = document.querySelector('.nav-item-dropdown');
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  
  // Mobile Drawer
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileAccordionBtn = document.querySelector('.mobile-accordion-btn');
  const mobileAccordionWrapper = document.querySelector('.mobile-accordion-wrapper');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');

  // Theme & RTL Controls (both desktop & mobile)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');

  // Auth Modal
  const loginBtns = document.querySelectorAll('.btn-login, .btn-mobile-login');
  const authModal = document.getElementById('auth-modal');
  const authModalClose = document.getElementById('auth-modal-close');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const authTabPanes = document.querySelectorAll('.auth-tab-pane');

  // ----------------------------------------------------
  // 2. Preloader Removal
  // ----------------------------------------------------
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 250);
    }
  });

  // Fallback in case load takes longer
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
    }
  }, 2000);

  // ----------------------------------------------------
  // 3. Fixed Header Scroll Shadow & Scroll-to-Top
  // ----------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------
  // 4. Click-Only Home Dropdown (Never on Hover)
  // ----------------------------------------------------
  if (dropdownTrigger && desktopDropdown) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = desktopDropdown.classList.contains('open');
      desktopDropdown.classList.toggle('open', !isOpen);
      dropdownTrigger.setAttribute('aria-expanded', !isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!desktopDropdown.contains(e.target)) {
        desktopDropdown.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && desktopDropdown.classList.contains('open')) {
        desktopDropdown.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        dropdownTrigger.focus();
      }
    });
  }

  // ----------------------------------------------------
  // 5. Mobile Drawer & Mobile Accordion
  // ----------------------------------------------------
  function resetMobileAccordions() {
    document.querySelectorAll('.mobile-accordion-wrapper').forEach(wrapper => {
      wrapper.classList.remove('mobile-accordion-open');
    });
  }

  function openMobileMenu() {
    if (mobileDrawer && mobileBackdrop) {
      resetMobileAccordions(); // Ensure Home dropdown strictly starts closed
      mobileDrawer.classList.add('open');
      mobileBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      resetMobileAccordions(); // Reset on close
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Mobile Accordion (Opens strictly when user clicks Home button, toggles closed on second click)
  document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrapper = btn.closest('.mobile-accordion-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('mobile-accordion-open');
      }
    });
  });

  // Clicking any mobile navigation link closes the mobile menu
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Ensure mobile menu closes automatically when switching/resizing to desktop viewports
  function syncMobileDrawerOnResize() {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
    const headerLoginBtn = document.getElementById('header-login-btn');
    if (window.innerWidth <= 1100) {
      if (headerLoginBtn) headerLoginBtn.style.setProperty('display', 'none', 'important');
    } else {
      if (headerLoginBtn) headerLoginBtn.style.removeProperty('display');
    }
  }
  window.addEventListener('resize', syncMobileDrawerOnResize);
  syncMobileDrawerOnResize();

  // ----------------------------------------------------
  // 6. Dark Mode Setup (Strict #000000 background)
  // ----------------------------------------------------
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'inline-block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'inline-block';
      }
    });
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleDarkMode);
  });
  updateThemeIcons(document.documentElement.classList.contains('dark'));

  // ----------------------------------------------------
  // 7. RTL / LTR Setup
  // ----------------------------------------------------
  const currentDir = localStorage.getItem('site_dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);

  function toggleDirection() {
    const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', activeDir);
    localStorage.setItem('site_dir', activeDir);
    updateRtlLabels(activeDir);
  }

  function updateRtlLabels(dir) {
    rtlToggleBtns.forEach(btn => {
      const label = btn.querySelector('.rtl-btn-text');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleDirection);
  });
  updateRtlLabels(currentDir);

  // ----------------------------------------------------
  // 8. Auth Modal (Login / Register Switcher)
  // ----------------------------------------------------
  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.getAttribute('href')) {
        closeMobileMenu();
        return;
      }
      e.preventDefault();
      closeMobileMenu();
      if (authModal) {
        authModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (authModalClose && authModal) {
    authModalClose.addEventListener('click', () => {
      authModal.classList.remove('open');
      document.body.style.overflow = '';
    });

    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        authModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      authTabPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });
    });
  });

  // ----------------------------------------------------
  // 9. Active Link Detection
  // ----------------------------------------------------
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '/' || currentPage === '') {
    currentPage = 'index.html';
  }
  currentPage = currentPage.split('?')[0].split('#')[0];

  const desktopDropdownTrigger = document.querySelector('.dropdown-trigger');
  const mobileAccordionTrigger = document.querySelector('.mobile-accordion-btn');

  // Highlight Home parent triggers when on Home 1 or Home 2
  if (currentPage === 'index.html' || currentPage === 'home-2.html') {
    if (desktopDropdownTrigger) desktopDropdownTrigger.classList.add('active');
    if (mobileAccordionTrigger) mobileAccordionTrigger.classList.add('active');
  }

  document.querySelectorAll('.desktop-nav a, .mobile-nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0];

    if (cleanHref === currentPage) {
      link.classList.add('active');
      if (link.closest('.dropdown-menu')) {
        desktopDropdownTrigger?.classList.add('active');
      }
      if (link.closest('.mobile-accordion-content')) {
        mobileAccordionTrigger?.classList.add('active');
      }
    }
  });

  // ----------------------------------------------------
  // 10. Accordion Toggles (Home 2 / FAQs)
  // ----------------------------------------------------
  document.querySelectorAll('.h2-accordion-trigger, .accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.h2-accordion-item, .accordion-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      
      // Close sibling items in same group
      const parentGroup = item.closest('.h2-accordion-group, .accordion-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.h2-accordion-item, .accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
        });
      }

      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // ----------------------------------------------------
  // 11. Console Tab Switchers (Services Console)
  // ----------------------------------------------------
  document.querySelectorAll('.sv-console-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      const container = btn.closest('.sv-console-section') || document;
      container.querySelectorAll('.sv-console-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.sv-console-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ----------------------------------------------------
  // 12. Interactive Load Calculator (Products Page)
  // ----------------------------------------------------
  const applianceItems = document.querySelectorAll('.pr-appliance-item');
  const totalKwhEl = document.getElementById('pr-calc-total');
  const recNameEl = document.getElementById('pr-rec-name');
  const recDescEl = document.getElementById('pr-rec-desc');

  if (applianceItems.length > 0 && totalKwhEl) {
    function updateLoadCalculation() {
      let totalWatts = 0;
      applianceItems.forEach(item => {
        if (item.classList.contains('selected')) {
          totalWatts += parseInt(item.getAttribute('data-watts') || '0', 10);
        }
      });

      const totalKw = (totalWatts / 1000).toFixed(1);
      totalKwhEl.textContent = `${totalKw} kW`;

      if (totalWatts <= 1500) {
        recNameEl.textContent = '3.5 kVA Pure Sine Wave Inverter';
        recDescEl.textContent = 'Ideal for lighting, fans, entertainment, and dual laptops.';
      } else if (totalWatts <= 4000) {
        recNameEl.textContent = '7.5 kVA Hybrid Lithium Storage System';
        recDescEl.textContent = 'Powers inverter AC, large refrigerator, and home server setup.';
      } else if (totalWatts <= 8000) {
        recNameEl.textContent = '15 kVA SilentGuard Diesel Standby Genset';
        recDescEl.textContent = 'Whole-home backup including multiple 2-ton ACs and water pump.';
      } else {
        recNameEl.textContent = '25 kVA Commercial-Grade Standby Unit';
        recDescEl.textContent = 'Heavy-duty 3-phase power for luxury villas and high-demand estates.';
      }
    }

    applianceItems.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        updateLoadCalculation();
      });
    });

    updateLoadCalculation();
  }

  // ----------------------------------------------------
  // 13. AMC Contract Tab Switchers (AMC Plans Page)
  // ----------------------------------------------------
  document.querySelectorAll('.amc-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      const container = btn.closest('.amc-selector-section') || document;
      container.querySelectorAll('.amc-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.amc-tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
});




