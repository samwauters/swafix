/**
 * SWAFIX - Main Interactive JavaScript Module
 */

function initAll() {
  initThemeToggle();
  initMobileMenu();
  initRepairEstimator();
  initStatusTracker();
  initFAQAccordion();
  initBookingModal();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* 1. Dark/Light Theme Switcher */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('swafix_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('swafix_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* 3. Multi-Select Dynamic Service & Price Estimator */
function initRepairEstimator() {
  const container = document.getElementById('services-checkbox-container');
  const speedSelect = document.getElementById('est-speed');
  const priceDisplay = document.getElementById('est-price-val');
  const timeDisplay = document.getElementById('est-time-val');
  const selectedList = document.getElementById('est-selected-list');
  const catFilter = document.getElementById('est-cat-filter');

  if (!container || !priceDisplay) return;

  const allServices = [
    // PC Support
    { id: 'pc_install', cat: 'laptop', catName: 'PC & Laptop Support', label: 'Nieuwe computer gebruiksklaar maken', price: 75, isHourly: false },
    { id: 'pc_transfer', cat: 'laptop', catName: 'PC & Laptop Support', label: 'Gegevens overzetten naar nieuwe computer', price: 45, isHourly: false },
    { id: 'pc_speedup', cat: 'laptop', catName: 'PC & Laptop Support', label: 'Computer sneller maken & opschonen', price: 75, isHourly: false },
    { id: 'pc_trouble', cat: 'laptop', catName: 'PC & Laptop Support', label: 'Computer problemen & foutmeldingen', price: 55, isHourly: true },

    // Smartphone
    { id: 'sp_setup', cat: 'smartphone', catName: 'Smartphone Support', label: 'Nieuwe smartphone volledig instellen & overzetten', price: 65, isHourly: false },
    { id: 'sp_homehelp', cat: 'smartphone', catName: 'Smartphone Support', label: 'Smartphone hulp aan huis', price: 55, isHourly: true },
    { id: 'sp_backup', cat: 'smartphone', catName: 'Smartphone Support', label: 'Back-up instellen (Google Drive / iCloud)', price: 35, isHourly: false },

    // Printer & Wifi
    { id: 'pr_install', cat: 'printer', catName: 'Printer & Wi-Fi', label: 'Printer installeren (PC, gsm & testpagina)', price: 45, isHourly: false },
    { id: 'pr_wifi', cat: 'printer', catName: 'Printer & Wi-Fi', label: 'Wi-Fi problemen & netwerkstoring oplossen', price: 55, isHourly: true },

    // Smart Home
    { id: 'sh_setup', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Nieuwe Home Assistant installatie & opzet', price: 200, isHourly: false },
    { id: 'sh_dash', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Dashboard ontwerpen', price: 75, isHourly: false },
    { id: 'sh_auto', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Automatiseringen maken', price: 25, isHourly: false },
    { id: 'sh_integ', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Nieuwe integraties toevoegen', price: 35, isHourly: false },
    { id: 'sh_camera', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Slimme camera installeren & app instellen', price: 75, isHourly: false },
    { id: 'sh_cam_ha', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: "Camera's koppelen aan Home Assistant", price: 45, isHourly: false },
    { id: 'sh_lights', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Slimme verlichting instellen', price: 35, isHourly: false },
    { id: 'sh_ghome', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Google Home installeren', price: 55, isHourly: false },
    { id: 'sh_chromecast', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Chromecast installeren', price: 35, isHourly: false },
    { id: 'sh_tv', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Smart TV instellen', price: 35, isHourly: false },
    { id: 'sh_trouble', cat: 'smarthome', catName: 'Slimme Woning & Home Assistant', label: 'Home Assistant probleemoplossing', price: 55, isHourly: true },

    // Software & Cloud
    { id: 'sw_google', cat: 'software', catName: 'Software, Cloud & Data', label: 'Google-account instellen', price: 35, isHourly: false },
    { id: 'sw_ms', cat: 'software', catName: 'Software, Cloud & Data', label: 'Microsoft-account instellen', price: 35, isHourly: false },
    { id: 'sw_cloud', cat: 'software', catName: 'Software, Cloud & Data', label: 'Cloudopslag instellen (Drive, OneDrive, iCloud)', price: 55, isHourly: false },
    { id: 'sw_sync', cat: 'software', catName: 'Software, Cloud & Data', label: 'Apparaten synchroniseren (laptop, gsm, tablet)', price: 55, isHourly: false },
    { id: 'sw_app', cat: 'software', catName: 'Software, Cloud & Data', label: 'Software installeren (Office, Adobe, Antivirus)', price: 25, isHourly: false },

    // Webdesign
    { id: 'web_site', cat: 'webdesign', catName: 'Webdesign & Hosting', label: 'Nieuwe basiswebsite (modern, mobiel, SEO)', price: 450, isHourly: false },
    { id: 'web_domain', cat: 'webdesign', catName: 'Webdesign & Hosting', label: 'Domeinnaam & hosting instellen (excl. hostingkosten)', price: 50, isHourly: false },
    { id: 'web_maint', cat: 'webdesign', catName: 'Webdesign & Hosting', label: 'Website onderhoud (per maand)', price: 15, isHourly: false },

    // Digitale Hulp
    { id: 'dh_home', cat: 'digihulp', catName: 'Digitale Hulp aan Huis', label: 'Digitale hulp aan huis (computer, gsm, TV)', price: 55, isHourly: true }
  ];

  const selectedIds = new Set(); // Geen standaard selectie, start op €0

  const speedMultipliers = {
    standard: { factor: 1.0, duration: 'Binnen 5 werkdagen' },
    express: { factor: 1.3, duration: 'Snelle afspraak (binnen 48u)' },
    emergency: { factor: 1.6, duration: 'Spoedinterventie (direct / zelfde dag)' }
  };

  function renderServices() {
    container.innerHTML = '';
    const activeCat = catFilter ? catFilter.value : 'all';

    const filtered = activeCat === 'all' 
      ? allServices 
      : allServices.filter(s => s.cat === activeCat);

    filtered.forEach(service => {
      const isChecked = selectedIds.has(service.id);
      const card = document.createElement('label');
      card.className = `flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
        isChecked 
          ? 'bg-theme-primary/10 border-theme-primary shadow-sm' 
          : 'bg-theme-base/60 border-theme-light hover:border-theme-secondary/50'
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3.5 pr-2">
          <input type="checkbox" value="${service.id}" ${isChecked ? 'checked' : ''} class="w-5 h-5 rounded border-theme-light text-theme-primary focus:ring-theme-primary cursor-pointer accent-[#F26A4A]">
          <div>
            <span class="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-0.5">${service.catName}</span>
            <span class="font-heading font-bold text-theme-dark text-sm md:text-base leading-snug">${service.label}</span>
          </div>
        </div>
        <div class="shrink-0 text-right pl-2">
          <span class="font-heading font-black text-theme-primary text-base md:text-lg">${service.isHourly ? `€${service.price}/u` : `€${service.price}`}</span>
        </div>
      `;

      const checkbox = card.querySelector('input');
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedIds.add(service.id);
        } else {
          selectedIds.delete(service.id);
        }
        renderServices();
        calculate();
      });

      container.appendChild(card);
    });
  }

  function calculate() {
    const speed = speedSelect ? speedSelect.value : 'standard';
    const speedData = speedMultipliers[speed] || speedMultipliers.standard;

    let fixedTotal = 0;
    let hourlyTotal = 0;
    const selectedItems = [];

    allServices.forEach(s => {
      if (selectedIds.has(s.id)) {
        selectedItems.push(s);
        if (s.isHourly) {
          hourlyTotal += s.price;
        } else {
          fixedTotal += s.price;
        }
      }
    });

    // Update selected badges/list
    if (selectedList) {
      if (selectedItems.length === 0) {
        selectedList.innerHTML = `<span class="text-xs text-theme-dark/50 italic">Geen diensten geselecteerd</span>`;
      } else {
        selectedList.innerHTML = selectedItems.map(item => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-theme-dark border border-theme-light font-medium text-xs shadow-2xs">
            <span>${item.label}</span>
            <span class="font-bold text-theme-primary">${item.isHourly ? `€${item.price}/u` : `€${item.price}`}</span>
          </span>
        `).join('');
      }
    }

    const calcFixed = Math.round(fixedTotal * speedData.factor);
    const calcHourly = Math.round(hourlyTotal * speedData.factor);

    let priceText = '€0';
    if (calcFixed > 0 && calcHourly > 0) {
      priceText = `€${calcFixed} + €${calcHourly}/u`;
    } else if (calcFixed > 0) {
      priceText = `€${calcFixed}`;
    } else if (calcHourly > 0) {
      priceText = `€${calcHourly}/u`;
    }

    // Update contact form tags box
    const contactTagsList = document.getElementById('contact-tags-list');
    if (contactTagsList) {
      if (selectedItems.length === 0) {
        contactTagsList.innerHTML = `<span class="text-xs text-theme-dark/50 italic">Geen specifieke dienst geselecteerd (kies optioneel in de calculator boven)</span>`;
      } else {
        const itemTags = selectedItems.map(item => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-dark border border-theme-primary/30 font-medium text-xs">
            <span>${item.label}</span>
            <span class="font-bold text-theme-primary">${item.isHourly ? `€${item.price}/u` : `€${item.price}`}</span>
            <button type="button" data-remove-id="${item.id}" class="text-theme-dark/40 hover:text-theme-primary font-bold ml-1 transition-colors">✕</button>
          </span>
        `).join('');

        const summaryTag = `
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-theme-secondary text-white font-heading font-bold text-xs shadow-sm">
            <span>Totaal: ${priceText}</span>
            <span class="opacity-80">(${speedData.duration})</span>
          </span>
        `;

        contactTagsList.innerHTML = itemTags + summaryTag;

        // Attach event listeners to remove buttons on tags
        contactTagsList.querySelectorAll('button[data-remove-id]').forEach(btn => {
          btn.onclick = (e) => {
            e.preventDefault();
            const idToRemove = btn.getAttribute('data-remove-id');
            selectedIds.delete(idToRemove);
            renderServices();
            calculate();
          };
        });
      }
    }

    priceDisplay.textContent = priceText;
    if (timeDisplay) timeDisplay.textContent = speedData.duration;

    // Animatie-effect bij prijswijziging
    priceDisplay.classList.add('scale-110', 'transition-transform', 'duration-200');
    setTimeout(() => {
      priceDisplay.classList.remove('scale-110');
    }, 200);
  }

  if (catFilter) {
    catFilter.addEventListener('change', renderServices);
  }
  if (speedSelect) {
    speedSelect.addEventListener('change', calculate);
  }

  renderServices();
  calculate();
}

/* 4. Live Repair Status Tracker */
function initStatusTracker() {
  const form = document.getElementById('tracker-form');
  const resultBox = document.getElementById('tracker-result');

  if (!form) return;

  const mockDatabase = {
    'SW-9821': { statusStep: 3, label: 'In de eindtest (Klaar om op te halen)', customer: 'Pietersen' },
    'SW-1042': { statusStep: 2, label: 'Onderdelen ingebouwd - Diagnose afgerond', customer: 'Vermeulen' },
    'SW-7733': { statusStep: 1, label: 'Ontvangen & Wacht op analyse', customer: 'De Smet' }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('tracker-id').value.trim().toUpperCase();
    const data = mockDatabase[inputVal] || { statusStep: 2, label: `Status voor ${inputVal}: Reparatie in behandeling.`, customer: 'Klant' };

    updateTimelineUI(data);
  });
}

function updateTimelineUI(data) {
  const steps = document.querySelectorAll('.step-item');
  const statusLabel = document.getElementById('tracker-status-text');

  steps.forEach((step, idx) => {
    if (idx + 1 <= data.statusStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  if (statusLabel) {
    statusLabel.textContent = data.label;
  }
}

/* 5. FAQ Accordion Logic */
function initFAQAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');

    if (btn && content) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all
        items.forEach(i => {
          i.classList.remove('active');
          const c = i.querySelector('.accordion-content');
          if (c) c.style.maxHeight = null;
        });

        // Toggle clicked
        if (!isOpen) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  });
}

/* 6. Booking Modal logic */
function initBookingModal() {
  const openBtns = document.querySelectorAll('.trigger-booking');
  const backdrop = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const bookingForm = document.getElementById('modal-booking-form');

  if (!backdrop) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      backdrop.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('active');
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('active');
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Bedankt! Uw afspraak-aanvraag bij SWAFIX is succesvol ontvangen. Wij nemen binnen 15 minuten contact op.');
      backdrop.classList.remove('active');
      bookingForm.reset();
    });
  }
}

/* 7. Smooth Scroll & Navbar Highlight */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
