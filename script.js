const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const IS_BLOG_SUBPAGE = window.location.pathname.includes('/blog/');
const LOCAL_PREFIX = IS_BLOG_SUBPAGE ? '../' : '';
const withLocalPrefix = (path) => `${LOCAL_PREFIX}${path}`;

const LOCAL_PRODUCT_LINKS = {
  'ALLE': 'products.html',
  'Produkte': 'products.html',
  'MerryMi Panda X 40K': 'produkt-panda-x-40k.html',
  'MerryMi M-Mecha 16K': 'produkt-m-mecha-16k.html',
  'MerryMi Blade 30K': 'produkt-blade-30k.html',
  'MerryMi Mecha Pro 35K': 'produkt-mecha-pro-35k.html',
  'MerryMi WiFlux 24K': 'produkt-wiflux-24k.html',
  'MerryMi Mecha X 36K': 'produkt-mecha-x-28k.html',
  'MerryMi Kitty 20K': 'produkt-kitty-20k.html',
  'MerryMi Panda Twins 40K': 'produkt-panda-twins-40k.html',
  'MerryMi MK20000 20K': 'produkt-mk20000-20k.html',
  'MerryMi Salts 30ml': 'produkt-salts-30ml.html'
};

const DBUCHA_PRODUCT_URLS = {
  'panda-x-40k': 'https://dezig.de/product/merry-mi-panda-x-40k-einweg-vape-disposable-5-nikotin/',
  'm-mecha-16k': 'https://dezig.de/product/merrymi-m-mecha-16k-einweg-vape-disposable-3-nikotin/',
  'blade-30k': 'https://dezig.de/product/merry-mi-blade-30k-einweg-vape-disposable-5-nikotin/',
  'mecha-pro-35k': 'https://dezig.de/product/merry-mi-mecha-pro-35k-einweg-vape-disposable-5-nikotin/',
  'wiflux-24k': 'https://dezig.de/product-category/merrymi-de/',
  'mecha-x-28k': 'https://dezig.de/en/merrymi-mecha-x-36k-and-merrymi-panda-twins-40k-new-exclusive-disposable-vapes-at-dezig-de/',
  'kitty-20k': 'https://dezig.de/product-category/merrymi-de/',
  'panda-twins-40k': 'https://dezig.de/en/product/merrymi-panda-twins-40k-disposable-vape-40000-puffs-2-nicotine/',
  'mk20000-20k': 'https://dezig.de/product/merry-mi-mk20000-einweg-vape-disposable-5-nikotin/',
  'salts-30ml': 'https://dezig.de/product/merrymi-e-liquid-30ml-5-nikotin-nikotinsalz-liquid/'
};

const DETAIL_FILE_TO_PRODUCT_ID = {
  'produkt-panda-x-40k.html': 'panda-x-40k',
  'produkt-m-mecha-16k.html': 'm-mecha-16k',
  'produkt-blade-30k.html': 'blade-30k',
  'produkt-mecha-pro-35k.html': 'mecha-pro-35k',
  'produkt-wiflux-24k.html': 'wiflux-24k',
  'produkt-mecha-x-28k.html': 'mecha-x-28k',
  'produkt-kitty-20k.html': 'kitty-20k',
  'produkt-panda-twins-40k.html': 'panda-twins-40k',
  'produkt-mk20000-20k.html': 'mk20000-20k',
  'produkt-salts-30ml.html': 'salts-30ml'
};

function getProductIdFromDetailHref(href) {
  if (!href) return '';
  const fileName = href.split('?')[0].split('#')[0].split('/').pop() || '';
  return DETAIL_FILE_TO_PRODUCT_ID[fileName] || '';
}

function applyBuyHref(anchor, href) {
  if (!anchor || !href) return;
  anchor.href = href;
  if (anchor.classList.contains('variant-card__cta')) {
    anchor.target = '_blank';
  }
}

function patchDbuchaBuyLinks() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const detailHref = card.querySelector('.product-card__media')?.getAttribute('href') || '';
    const productId = getProductIdFromDetailHref(detailHref);
    const buyHref = DBUCHA_PRODUCT_URLS[productId];
    const buyButton = card.querySelector('.cta-secondary-link');
    applyBuyHref(buyButton, buyHref);
  });

  const pageFile = (window.location.pathname.split('/').pop() || '').split('?')[0];
  const currentProductId = DETAIL_FILE_TO_PRODUCT_ID[pageFile] || '';
  const currentBuyHref = DBUCHA_PRODUCT_URLS[currentProductId];
  if (currentBuyHref) {
    document.querySelectorAll('.product-detail .section-cta-strip__secondary, .variant-card__cta, .promo-banner__btn--secondary').forEach((anchor) => {
      applyBuyHref(anchor, currentBuyHref);
    });
  }
}

function patchFooterProductLinks() {
  document.querySelectorAll('.site-footer .footer-links a').forEach((link) => {
    const key = link.textContent?.trim() || '';
    const localHref = LOCAL_PRODUCT_LINKS[key];
    if (localHref) link.href = withLocalPrefix(localHref);
    if (key.toLowerCase() === 'über uns' || key.toLowerCase() === 'o nas') link.href = withLocalPrefix('about-us.html');
    if (key.toLowerCase() === 'faq' || key.toLowerCase() === 'najczęściej zadawane pytania') link.href = withLocalPrefix('index.html#faq');
    if (key.toLowerCase() === 'blog' || key.toLowerCase() === 'aktualności') link.href = withLocalPrefix('index.html#aktualnosci');
  });
}

function patchFooterContactInfo() {
  document.querySelectorAll('.site-footer .footer-contact').forEach((contactBox) => {
    const rows = Array.from(contactBox.querySelectorAll('p'));
    const phoneRow = rows.find((row) => row.textContent?.toLowerCase().includes('tel') || row.textContent?.toLowerCase().includes('whatsapp'));
    let businessRow = rows.find((row) => row.textContent?.toLowerCase().includes('geschäftlicher kontakt') || row.textContent?.toLowerCase().includes('kontakt biznesowy'));
    let normalizedPhoneRow = phoneRow;

    if (!businessRow) {
      businessRow = document.createElement('p');
      if (phoneRow) {
        contactBox.insertBefore(businessRow, phoneRow);
      } else {
        contactBox.appendChild(businessRow);
      }
    }

    businessRow.innerHTML = `
      <span class="footer-title">Geschäftlicher Kontakt:</span>
    `;

    if (!normalizedPhoneRow) {
      normalizedPhoneRow = document.createElement('p');
      contactBox.appendChild(normalizedPhoneRow);
    }

    const rawText = normalizedPhoneRow.textContent || '';
    const numberMatch = rawText.match(/\+?\d[\d\s-]{7,}\d/);
    const displayNumber = numberMatch ? numberMatch[0].trim() : '+49 1521 5745001';
    const waNumber = displayNumber.replace(/[^\d]/g, '');
    const whatsappIcon = withLocalPrefix('images/whatsapp-icon.svg');
    normalizedPhoneRow.setAttribute('style', 'color: orange; text-decoration: underline; display: flex; align-items: center; gap: 4px;');
    normalizedPhoneRow.innerHTML = `<img src="${whatsappIcon}" alt="WhatsApp" width="24" height="24"> <a href="https://wa.me/${waNumber}" target="_blank">${displayNumber}</a>`;
  });
}

function setupFooterEmailCopy() {
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    if (button.dataset.copyBound === 'true') return;
    button.dataset.copyBound = 'true';
    const originalLabel = button.textContent || 'Kopieren';

    const copyFallback = (value) => {
      const textArea = document.createElement('textarea');
      textArea.value = value;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    };

    button.addEventListener('click', async () => {
      const email = button.getAttribute('data-copy-email') || 'info@dezig.de';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          copyFallback(email);
        }
        button.textContent = 'Kopiert';
      } catch (_error) {
        button.textContent = 'Fehler';
      }

      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1500);
    });
  });
}

patchFooterProductLinks();
patchFooterContactInfo();
setupFooterEmailCopy();
patchDbuchaBuyLinks();

if (mobileNav && mobileNav.parentElement !== document.body) {
  document.body.appendChild(mobileNav);
}

const mobileNavInner = mobileNav?.querySelector('.mobile-nav__inner');
if (mobileNavInner && !mobileNavInner.querySelector('.mobile-nav__brand')) {
  const brand = document.createElement('a');
  brand.className = 'mobile-nav__brand';
  brand.href = withLocalPrefix('index.html');
  brand.setAttribute('aria-label', 'MerryMi - Startseite');
  brand.innerHTML = '<img src="images/einweg-vape-merrymi-logo-merrymi.png" alt="Logo MerryMi" width="160" height="44">';
  mobileNavInner.prepend(brand);
}

if (mobileNavInner) {
  mobileNavInner.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector('summary');
    const label = summary?.textContent?.trim() || '';
    if (!summary) return;

    const replacementLink = document.createElement('a');
    if (label.toUpperCase() === 'PRODUKTY' || label.toUpperCase() === 'PRODUKTE') {
      replacementLink.href = withLocalPrefix('products.html');
    } else if (label.toUpperCase() === 'O NAS' || label.toUpperCase() === 'ÜBER UNS') {
      replacementLink.href = withLocalPrefix('about-us.html');
    } else {
      replacementLink.href = 'https://dezig.de/merrymi-kollektion-dezig/';
    }
    replacementLink.textContent = label;
    replacementLink.className = 'mobile-nav__top-link';
    details.replaceWith(replacementLink);
  });
}

document.querySelectorAll('.brand a').forEach((link) => {
  link.href = withLocalPrefix('index.html');
});

document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
  const label = link.textContent?.trim().toUpperCase();
  if (label === 'STRONA GŁÓWNA' || label === 'STARTSEITE') {
    link.href = withLocalPrefix('index.html');
  }
  if (label === 'AKTUALNOŚCI' || label === 'BLOG' || label === 'NEWS' || label === 'NEUIGKEITEN') {
    link.href = withLocalPrefix('index.html#aktualnosci');
  }
  if (label === 'O NAS' || label === 'ÜBER UNS') {
    link.href = withLocalPrefix('about-us.html');
  }
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  const label = link.textContent?.trim().toUpperCase();
  if (label === 'PRODUKTY' || label === 'PRODUKTE') {
    link.href = withLocalPrefix('products.html');
  }
});

function setupWholesaleModal() {
  const desktopNavs = Array.from(document.querySelectorAll('.desktop-nav'));
  const mobileNavInners = Array.from(document.querySelectorAll('.mobile-nav__inner'));
  if (!desktopNavs.length && !mobileNavInners.length) return;

  desktopNavs.forEach((nav) => {
    if (nav.querySelector('[data-open-wholesale]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-wholesale-btn';
    button.setAttribute('data-open-wholesale', '');
    button.innerHTML = 'Großhandel';
    nav.appendChild(button);
  });

  mobileNavInners.forEach((inner) => {
    if (inner.querySelector('[data-open-wholesale]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-wholesale-btn';
    button.setAttribute('data-open-wholesale', '');
    button.innerHTML = 'Großhandel';
    inner.appendChild(button);
  });

  let modal = document.querySelector('[data-wholesale-modal]');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'wholesale-modal';
    modal.setAttribute('data-wholesale-modal', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'wholesale-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    modal.innerHTML = `
      <div class="wholesale-modal__backdrop" data-close-wholesale-modal></div>
      <div class="wholesale-modal__dialog">
        <button class="wholesale-modal__close" type="button" aria-label="Schließen" data-close-wholesale-modal>×</button>
        <p class="wholesale-modal__eyebrow">Großhandel / B2B</p>
        <h2 id="wholesale-title" class="wholesale-modal__title-row">Mehr kaufen und sparen</h2>
        <p class="wholesale-modal__lead">Bei B2B- und Großhandelsbestellungen wird der Rabatt automatisch berechnet, sobald die entsprechende Anzahl an Vapes im Warenkorb liegt.</p>
        <div class="wholesale-tier-list">
          <div class="wholesale-tier"><span>KAUFE 3 - 4</span><strong>-10% RABATT</strong></div>
          <div class="wholesale-tier"><span>KAUFE 5 - 9</span><strong>-15% RABATT</strong></div>
          <div class="wholesale-tier"><span>KAUFE 10+</span><strong>-20% RABATT</strong></div>
        </div>
        <div class="wholesale-modal__actions">
          <a class="wholesale-modal__order" href="https://dezig.de/merrymi-kollektion-dezig/">Jetzt bestellen</a>
        </div>
        <p class="wholesale-modal__note">Der Großhandelsrabatt gilt für MerryMi-Produkte und kann nicht mit anderen Gutscheincodes kombiniert werden.</p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const openModal = () => {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (mobileNav) mobileNav.classList.remove('is-open');
    document.body.classList.remove('mobile-menu-open');
    document.querySelector('.mobile-nav-overlay')?.classList.remove('is-open');
    document.querySelectorAll('.mobile-nav details[open]').forEach((item) => {
      item.open = false;
    });
  };

  document.querySelectorAll('[data-open-wholesale]').forEach((button) => {
    button.addEventListener('click', openModal);
  });

  modal.querySelectorAll('[data-close-wholesale-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
}

setupWholesaleModal();

function setupArrivalModal() {
  const isHomepage =
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('/index.html') ||
    !!document.querySelector('.hero-slider');

  if (isHomepage) return;

  let modal = document.querySelector('[data-arrival-modal]');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'arrival-modal';
    modal.setAttribute('data-arrival-modal', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'arrival-modal-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    modal.innerHTML = `
      <div class="arrival-modal__backdrop" data-close-arrival-modal></div>
      <div class="arrival-modal__dialog">
        <div class="arrival-modal__confetti" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <button class="arrival-modal__close" type="button" aria-label="Schließen" data-close-arrival-modal>×</button>
        <div class="arrival-modal__reward" aria-hidden="true">HERZLICHEN GLÜCKWUNSCH</div>
        <p class="arrival-modal__eyebrow">Du hast Zugriff auf die neuesten MerryMi-Modelle</p>
        <h2 id="arrival-modal-title">Mecha X 36K und Panda Twins 40K</h2>
        <p class="arrival-modal__lead">Die neuen Einweg Vapes von MerryMi sind jetzt erhältlich. Wähle dein Modell und gelange direkt zum Produkt.</p>
        <div class="arrival-modal__actions">
          <a class="arrival-modal__cta arrival-modal__cta--primary" href="https://dezig.de/en/merrymi-mecha-x-36k-and-merrymi-panda-twins-40k-new-exclusive-disposable-vapes-at-dezig-de/">Mecha X 36K kaufen</a>
          <a class="arrival-modal__cta arrival-modal__cta--primary" href="https://dezig.de/en/product/merrymi-panda-twins-40k-disposable-vape-40000-puffs-2-nicotine/">Panda Twins 40K kaufen</a>
        </div>
        <div class="arrival-modal__image-wrap">
          <img src="images/neues-von-merrymi.png" alt="Neue MerryMi-Modelle" loading="lazy">
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    sessionStorage.setItem('merrymi-arrival-modal-dismissed', 'true');
  };

  const openModal = () => {
    if (sessionStorage.getItem('merrymi-arrival-modal-dismissed') === 'true') return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  modal.querySelectorAll('[data-close-arrival-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  window.setTimeout(openModal, 700);
}

setupArrivalModal();

if (menuToggle && mobileNav) {
  let overlay = document.querySelector('.mobile-nav-overlay');
  if (!overlay) {
    overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'mobile-nav-overlay';
    overlay.setAttribute('aria-label', 'Menü schließen');
    document.body.appendChild(overlay);
  }

  const setMobileMenuState = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('is-open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    overlay.classList.toggle('is-open', open);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMobileMenuState(!isOpen);
  });

  overlay.addEventListener('click', () => {
    setMobileMenuState(false);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  });

  let navTouchStartX = 0;
  let navTouchStartY = 0;
  let navTouchDeltaX = 0;
  let navTracking = false;
  const NAV_SWIPE_CLOSE_THRESHOLD = 60;

  mobileNav.addEventListener('touchstart', (event) => {
    if (!mobileNav.classList.contains('is-open')) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    navTouchStartX = touch.clientX;
    navTouchStartY = touch.clientY;
    navTouchDeltaX = 0;
    navTracking = true;
  }, { passive: true });

  mobileNav.addEventListener('touchmove', (event) => {
    if (!navTracking) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    navTouchDeltaX = touch.clientX - navTouchStartX;
    const deltaY = touch.clientY - navTouchStartY;
    if (Math.abs(navTouchDeltaX) > Math.abs(deltaY) && navTouchDeltaX < 0 && event.cancelable) {
      event.preventDefault();
    }
  }, { passive: false });

  const closeBySwipe = () => {
    if (!navTracking) return;
    navTracking = false;
    if (navTouchDeltaX <= -NAV_SWIPE_CLOSE_THRESHOLD) {
      setMobileMenuState(false);
    }
  };

  mobileNav.addEventListener('touchend', closeBySwipe);
  mobileNav.addEventListener('touchcancel', closeBySwipe);
}

const heroSlider = document.querySelector('[data-slider]');

if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll('[data-slide]'));
  const dotsContainer = heroSlider.querySelector('.hero-dots');
  const prevButton = heroSlider.querySelector('[data-direction="prev"]');
  const nextButton = heroSlider.querySelector('[data-direction="next"]');
  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  let intervalId;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  if (currentIndex < 0) currentIndex = 0;

  const setSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    dotsContainer.querySelectorAll('.hero-dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentIndex);
      dot.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false');
    });

    const activeSlide = slides[currentIndex];
    heroSlider.classList.toggle('hero-slider--plain-active', activeSlide?.classList.contains('hero-slide--plain'));
  };

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot';
    dot.setAttribute('aria-label', `Gehe zu Slide ${index + 1}`);
    dot.addEventListener('click', () => {
      setSlide(index);
      restartAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const restartAutoplay = () => {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(() => setSlide(currentIndex + 1), 5500);
  };

  prevButton?.addEventListener('click', () => {
    setSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    setSlide(currentIndex + 1);
    restartAutoplay();
  });

  heroSlider.addEventListener('mouseenter', () => window.clearInterval(intervalId));
  heroSlider.addEventListener('mouseleave', restartAutoplay);
  heroSlider.addEventListener('focusin', () => window.clearInterval(intervalId));
  heroSlider.addEventListener('focusout', restartAutoplay);

  const SWIPE_THRESHOLD = 45;
  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchDeltaX = 0;
    isSwiping = true;
    window.clearInterval(intervalId);
  };

  const onTouchMove = (event) => {
    if (!isSwiping) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    touchDeltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(touchDeltaX) > Math.abs(deltaY) && event.cancelable) {
      event.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;

    if (Math.abs(touchDeltaX) >= SWIPE_THRESHOLD) {
      if (touchDeltaX < 0) {
        setSlide(currentIndex + 1);
      } else {
        setSlide(currentIndex - 1);
      }
    }

    restartAutoplay();
  };

  heroSlider.addEventListener('touchstart', onTouchStart, { passive: true });
  heroSlider.addEventListener('touchmove', onTouchMove, { passive: false });
  heroSlider.addEventListener('touchend', onTouchEnd);
  heroSlider.addEventListener('touchcancel', onTouchEnd);

  setSlide(currentIndex);
  restartAutoplay();
}

const videoCarousel = document.querySelector('[data-video-carousel]');

if (videoCarousel && window.matchMedia('(min-width: 768px)').matches) {
  const cards = Array.from(videoCarousel.querySelectorAll('[data-video-card]'));
  const prevButton = videoCarousel.querySelector('[data-video-direction="prev"]');
  const nextButton = videoCarousel.querySelector('[data-video-direction="next"]');
  let activeIndex = cards.findIndex((card) => card.classList.contains('is-active'));

  if (activeIndex < 0) activeIndex = 0;

  const pauseAllVideos = () => {
    cards.forEach((card) => {
      const video = card.querySelector('video');
      const button = card.querySelector('.video-toggle');
      video?.pause();
      card.classList.remove('is-playing');
      if (button) button.textContent = 'Abspielen';
    });
  };

  const updateVideoCarousel = () => {
    const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
    const nextIndex = (activeIndex + 1) % cards.length;

    cards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-prev', 'is-next');
      card.hidden = ![prevIndex, activeIndex, nextIndex].includes(index);

      if (index === activeIndex) card.classList.add('is-active');
      if (index === prevIndex) card.classList.add('is-prev');
      if (index === nextIndex) card.classList.add('is-next');
    });
  };

  prevButton?.addEventListener('click', () => {
    pauseAllVideos();
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    updateVideoCarousel();
  });

  nextButton?.addEventListener('click', () => {
    pauseAllVideos();
    activeIndex = (activeIndex + 1) % cards.length;
    updateVideoCarousel();
  });

  cards.forEach((card) => {
    const video = card.querySelector('video');
    const button = card.querySelector('.video-toggle');

    if (!video || !button) return;

    button.addEventListener('click', async () => {
      const isPlaying = !video.paused && !video.ended;

      if (isPlaying) {
        video.pause();
        card.classList.remove('is-playing');
        button.textContent = 'Abspielen';
        return;
      }

      pauseAllVideos();

      try {
        await video.play();
        card.classList.add('is-playing');
        button.textContent = 'Pause';
      } catch (error) {
        button.textContent = 'Abspielen';
      }
    });

    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
      button.textContent = 'Abspielen';
    });
  });

  updateVideoCarousel();
} else {
  document.querySelectorAll('[data-video-card]').forEach((card) => {
    const video = card.querySelector('video');
    const button = card.querySelector('.video-toggle');

    if (!video || !button) return;

    button.addEventListener('click', async () => {
      const isPlaying = !video.paused && !video.ended;

      if (isPlaying) {
        video.pause();
        button.textContent = 'Abspielen';
        return;
      }

      document.querySelectorAll('[data-video-card] video').forEach((item) => item.pause());
      document.querySelectorAll('.video-toggle').forEach((item) => {
        item.textContent = 'Abspielen';
      });

      try {
        await video.play();
        button.textContent = 'Pause';
      } catch (error) {
        button.textContent = 'Abspielen';
      }
    });

    video.addEventListener('ended', () => {
      button.textContent = 'Abspielen';
    });
  });
}

const productPage = document.querySelector('.product-page');

if (productPage) {
  const detailContainer = productPage.querySelector('.product-detail');
  const ctaGroup = productPage.querySelector('.product-detail .cta-group');
  const backButton = ctaGroup?.querySelector('.section-cta-strip__primary[href="products.html"]');

  if (detailContainer && backButton) {
    const backRow = document.createElement('div');
    backRow.className = 'container product-back-row';
    backButton.textContent = 'Zurück zur Übersicht';
    backRow.appendChild(backButton);
    productPage.insertBefore(backRow, detailContainer);
  }

  const variantsList = productPage.querySelector('.variants-list');
  const variantsGallery = productPage.querySelector('.variants-gallery');

  if (variantsList && variantsGallery) {
    const LIST_LIMIT = 12;
    const variantItems = Array.from(variantsList.querySelectorAll('.variant-item'));
    const variantCards = Array.from(variantsGallery.querySelectorAll('.variant-card'));
    const hasMore = variantItems.length > LIST_LIMIT;
    let collapsed = hasMore;

    variantItems.forEach((item, index) => {
      if (index >= LIST_LIMIT) item.dataset.extraVariant = '1';
    });
    const toggleItem = document.createElement('li');
    toggleItem.className = 'variant-item variant-item--toggle';
    const showMoreBtn = document.createElement('button');
    showMoreBtn.type = 'button';
    showMoreBtn.className = 'variants-show-more';
    showMoreBtn.setAttribute('data-variants-toggle', '');
    showMoreBtn.textContent = 'Mehr Geschmacksrichtungen anzeigen';
    toggleItem.appendChild(showMoreBtn);
    variantsList.appendChild(toggleItem);

    if (hasMore) {
      variantsList.classList.add('is-collapsed');
      toggleItem.hidden = false;
      showMoreBtn.setAttribute('aria-expanded', 'false');
      showMoreBtn.textContent = 'Mehr Geschmacksrichtungen anzeigen';

      showMoreBtn.addEventListener('click', () => {
        collapsed = !collapsed;
        variantsList.classList.toggle('is-collapsed', collapsed);
        showMoreBtn.setAttribute('aria-expanded', String(!collapsed));
        showMoreBtn.textContent = collapsed ? 'Mehr Geschmacksrichtungen anzeigen' : 'Weniger Geschmacksrichtungen anzeigen';
      });
    } else {
      toggleItem.hidden = true;
    }

    if (variantItems.length || variantCards.length) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'variant-search';
      searchWrap.innerHTML = `
        <label class="variant-search__label" for="variant-search-input">Geschmack suchen</label>
        <input id="variant-search-input" class="variant-search__input" type="search" placeholder="Geschmack eingeben..." autocomplete="off">
      `;

      variantsGallery.parentNode.insertBefore(searchWrap, variantsGallery);
      const searchInput = searchWrap.querySelector('.variant-search__input');

      const getText = (el) => (el.textContent || '').toLowerCase();

      const applyFilter = (query) => {
        const needle = query.trim().toLowerCase();
        const searching = needle.length > 0;

        if (hasMore && searching) {
          variantsList.classList.remove('is-collapsed');
          toggleItem.hidden = true;
        } else if (hasMore && !searching) {
          variantsList.classList.toggle('is-collapsed', collapsed);
          toggleItem.hidden = false;
        }

        variantItems.forEach((item) => {
          const visible = !needle || getText(item).includes(needle);
          item.hidden = !visible;
        });

        variantCards.forEach((card) => {
          const title = card.querySelector('h3');
          const visible = !needle || getText(title || card).includes(needle);
          card.hidden = !visible;
        });
      };

      searchInput?.addEventListener('input', (event) => {
        applyFilter(event.target.value || '');
      });
    }
  }
}

const PRODUCT_REVIEW_AVERAGE = {
  'panda-x-40k': 4.7,
  'm-mecha-16k': 4.7,
  'blade-30k': 4.7,
  'mecha-pro-35k': 4.9,
  'wiflux-24k': 4.7,
  'mecha-x-28k': 4.7,
  'kitty-20k': 4.7,
  'panda-twins-40k': 4.9,
  'mk20000-20k': 4.7,
  'salts-30ml': 4.9
};

const HARD_CODED_REVIEWS = [
  { author: 'Jonas Weber', rating: 5, text: 'Der Geschmack bleibt von Anfang bis Ende absolut intensiv.' },
  { author: 'Maximilian Becker', rating: 5, text: 'Sehr stabile Dampfabgabe und ein fantastisch kräftiges Aroma.' },
  { author: 'Lukas Wagner', rating: 4, text: 'Gute Option für jeden Tag, absolut zuverlässig und schick.' },
  { author: 'Anna Schmidt', rating: 5, text: 'Hervorragende Balance zwischen der Süße und einer angenehmen Frische.' },
  { author: 'Laura Schneider', rating: 5, text: 'Sehr handliches Format und ein wunderbar klarer Geschmack.' },
  { author: 'Finn Meyer', rating: 4, text: 'Nutze ich regelmäßig und bin rundum zufrieden.' },
  { author: 'Marie Fischer', rating: 5, text: 'Die gleichbleibende Geschmacksqualität bis zum letzten Zug gefällt mir am besten.' },
  { author: 'Leon Weber', rating: 4, text: 'Gutes Produkt, sehr ordentliche Zugleistung.' },
  { author: 'Paul Schulz', rating: 5, text: 'Intensives Aroma und eine absolut saubere Funktion des Geräts.' },
  { author: 'Sarah Hoffmann', rating: 5, text: 'Sieht in echt sogar noch besser aus als auf den Bildern.' },
  { author: 'Ben Koch', rating: 4, text: 'Große Auswahl an Sorten, man findet sehr schnell seinen Lieblingsgeschmack.' },
  { author: 'Julia Bauer', rating: 5, text: 'Der Geschmack lässt auch nach mehreren Tagen intensiver Nutzung nicht nach.' },
  { author: 'Felix Richter', rating: 4, text: 'Hervorragende B2B-Qualität, komplett auslaufsicher konstruiert.' },
  { author: 'Emma Klein', rating: 5, text: 'Sehr angenehmes Zugverhalten und eine feine Entfaltung der Aromen.' },
  { author: 'Tim Schröder', rating: 5, text: 'Genau das, was ich von einer Premium-Vape erwartet habe.' },
  { author: 'David Neumann', rating: 4, text: 'Funktioniert absolut fehlerfrei, der Akku hält erstaunlich lange.' },
  { author: 'Clara Zimmermann', rating: 5, text: 'Die Geschmackskombinationen sind wirklich meisterhaft abgestimmt.' },
  { author: 'Luis Krüger', rating: 4, text: 'Ein sehr solides Produkt in dieser Premium-Klasse.' },
  { author: 'Sophia Lange', rating: 5, text: 'Elegantes Design und ein ausgesprochen reiner Geschmack.' },
  { author: 'Jonas Hartmann', rating: 5, text: 'Eines der besten Einweg-Geräte, die ich bisher getestet habe.' },
  { author: 'Lena Schmitt', rating: 4, text: 'Sehr angenehmes Dampfgefühl, absolut keine Kratzer im Hals.' },
  { author: 'Philipp Krause', rating: 5, text: 'Ordentlicher Throat Hit und ein sehr sauberes Geschmacksbild.' },
  { author: 'Nele Werner', rating: 5, text: 'Der Geschmack ist klar und nicht zu aufdringlich süß.' },
  { author: 'Alexander Vogel', rating: 4, text: 'Es gibt nichts zu bemängeln, alles funktioniert wie gewünscht.' },
  { author: 'Emilie Frank', rating: 5, text: 'Ist blitzschnell zu meiner absoluten Lieblingsmarke geworden.' },
  { author: 'Julian Meier', rating: 4, text: 'Sehr gutes Preis-Leistungs-Verhältnis für diese hohe Zugzahl.' },
  { author: 'Hannah Gabriel', rating: 5, text: 'Perfekte Option für alle Liebhaber von reichhaltigem, fruchtigem Dampf.' },
  { author: 'Nico Peters', rating: 5, text: 'Hervorragende Haptik und eine bemerkenswert solide Konstruktion.' },
  { author: 'Luisa Scholz', rating: 4, text: 'Sehr gelungener Kauf, werde bestimmt die anderen Sorten auch testen.' },
  { author: 'Simon Berger', rating: 5, text: 'Kann ich wärmstens empfehlen, vor allem wegen der beständigen Dampfqualität.' }
];

const HOME_REVIEW_PRODUCTS = {
  'm-mecha-16k': {
    title: 'MerryMi M-Mecha 16K',
    image: 'images/einweg-vape-merrymi-baner-m-mecha-16k-mobile.png'
  },
  'panda-x-40k': {
    title: 'MerryMi Panda X 40K',
    image: 'images/einweg-vape-merrymi-baner-panda-x-40k-mobile.png'
  },
  'blade-30k': {
    title: 'MerryMi Blade 30K',
    image: 'images/einweg-vape-merrymi-produkt-blade-30k.png'
  },
  'mecha-pro-35k': {
    title: 'MerryMi Mecha Pro 35K',
    image: 'images/merrymi-mecha-pro-35k.jpg'
  },
  'wiflux-24k': {
    title: 'MerryMi WiFlux 24K',
    image: 'images/einweg-vape-merrymi-produkt-wiflux-24k.png.png'
  },
  'mecha-x-28k': {
    title: 'MerryMi Mecha X 36K',
    image: 'images/einweg-vape-merrymi-produkt-mecha-x-28k.png'
  },
  'kitty-20k': {
    title: 'MerryMi Kitty 20K',
    image: 'images/einweg-vape-merrymi-produkt-kitty-20k.png'
  },
  'panda-twins-40k': {
    title: 'MerryMi Panda Twins 40K',
    image: 'images/einweg-vape-merrymi-produkt-panda-twins-40k.png'
  },
  'mk20000-20k': {
    title: 'MerryMi MK20000 20K',
    image: 'images/merrymi-mk20000-20k.png'
  },
  'salts-30ml': {
    title: 'MerryMi Salts 30ml',
    image: 'images/merrymi-liquids-30ml.png'
  }
};

const HOME_REVIEWS = [
  { author: 'Jonas Weber', date: '22.03.2026', rating: 4.9, text: 'Hervorragende Qualität und ein extrem gleichmäßiger Geschmack.', productId: 'm-mecha-16k' },
  { author: 'Anna Schmidt', date: '21.03.2026', rating: 4.8, text: 'Sehr gelungener Kauf, werde definitiv weitere Sorten bestellen.', productId: 'panda-x-40k' },
  { author: 'Maximilian Becker', date: '20.03.2026', rating: 5.0, text: 'Intensives Aroma und eine hervorragende Dampfentwicklung.', productId: 'blade-30k' },
  { author: 'Laura Schneider', date: '19.03.2026', rating: 4.7, text: 'Design und Haptik liegen auf einem absolut hohen Niveau.', productId: 'mecha-pro-35k' },
  { author: 'Finn Meyer', date: '18.03.2026', rating: 4.9, text: 'Der Geschmack ist von Anfang bis Ende voll da.', productId: 'wiflux-24k' },
  { author: 'Marie Fischer', date: '17.03.2026', rating: 4.8, text: 'Die perfekte Wahl für den täglichen Genuss unterwegs.', productId: 'mecha-x-28k' },
  { author: 'Leon Weber', date: '16.03.2026', rating: 4.9, text: 'Zuverlässiges Gerät mit einem ordentlichen, reinen Hit.', productId: 'kitty-20k' },
  { author: 'Emma Klein', date: '15.03.2026', rating: 5.0, text: 'Die beste Vape-Serie, die ich bisher probiert habe.', productId: 'panda-twins-40k' },
  { author: 'Tim Schröder', date: '14.03.2026', rating: 4.7, text: 'Ausgezeichnetes Preis-Leistungs-Verhältnis bei der hohen Kapazität.', productId: 'mk20000-20k' },
  { author: 'Clara Zimmermann', date: '13.03.2026', rating: 4.9, text: 'Klasse Aromen, kann die Liquids nur weiterempfehlen.', productId: 'salts-30ml' },
  { author: 'Julian Meier', date: '12.03.2026', rating: 4.8, text: 'Überzeugt mich jeden Tag aufs Neue durch Stabilität.', productId: 'm-mecha-16k' },
  { author: 'Hannah Gabriel', date: '11.03.2026', rating: 5.0, text: 'Die enorme Zuganzahl macht sich im Alltag bezahlt.', productId: 'panda-x-40k' },
  { author: 'Sarah Hoffmann', date: '10.03.2026', rating: 4.7, text: 'Dichter Dampf und exzellente Entfaltung der Fruchtnoten.', productId: 'blade-30k' },
  { author: 'Philipp Krause', date: '09.03.2026', rating: 4.9, text: 'Keinerlei Probleme, das System ist absolut auslaufsicher.', productId: 'mecha-pro-35k' },
  { author: 'Alexander Vogel', date: '08.03.2026', rating: 4.8, text: 'Sehr hoher Nutzungskomfort und tolle Haptik.', productId: 'wiflux-24k' },
  { author: 'Nele Werner', date: '07.03.2026', rating: 5.0, text: 'Aktuell mein absoluter Favorit unter den Vapes.', productId: 'mecha-x-28k' },
  { author: 'Nico Peters', date: '06.03.2026', rating: 4.7, text: 'Sehr guter Einstieg in das Sortiment.', productId: 'kitty-20k' },
  { author: 'Luisa Scholz', date: '05.03.2026', rating: 4.9, text: 'Die Duo-Geschmäcker sind absolut stimmig komponiert.', productId: 'panda-twins-40k' },
  { author: 'Simon Berger', date: '04.03.2026', rating: 4.8, text: 'Kompaktes Design kombiniert mit einem starken Aroma.', productId: 'mk20000-20k' },
  { author: 'Emilie Frank', date: '03.03.2026', rating: 5.0, text: 'Das Nikotinsalz läuft perfekt in meinem Pod-System.', productId: 'salts-30ml' }
];

function renderHomeReviews() {
  const host = document.querySelector('[data-home-reviews]');
  if (!host) return;
  if (host.querySelector('.reviews-marquee')) return;

  const topReviews = HOME_REVIEWS.slice(0, 10);
  const bottomReviews = HOME_REVIEWS.slice(10);
  const avg = HOME_REVIEWS.reduce((sum, review) => sum + review.rating, 0) / HOME_REVIEWS.length;

  const createCard = (review) => {
    const product = HOME_REVIEW_PRODUCTS[review.productId];
    if (!product) return '';
    return `
      <article class="review-card review-card--product">
        <div class="review-card__top">
          <div class="review-card__reviewer">
            <p class="review-card__name">${review.author}</p>
            <span class="review-card__verified">✔ Verifizierter Kauf</span>
          </div>
          <p class="review-card__date">${review.date}</p>
          <div class="review-card__rating-line">
            <span class="review-card__stars">★★★★★</span>
            <span class="review-card__score">${review.rating.toFixed(1)}/5</span>
          </div>
          <p class="review-card__text">“${review.text}”</p>
        </div>
        <div class="review-card__product">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <p>${product.title}</p>
        </div>
      </article>
    `;
  };

  host.innerHTML = `
    <div class="section-title section-title--center">
      <h2 id="home-reviews-title">Kundenbewertungen für MerryMi Vapes</h2>
    </div>
    <p class="reviews-summary">Durchschnittliche Bewertung unseres Angebots: <strong>${avg.toFixed(1)}/5</strong></p>
    <div class="reviews-marquee reviews-marquee--right" aria-label="Kundenbewertungen - Reihe 1">
      <div class="reviews-track">
        ${topReviews.map(createCard).join('')}
        ${topReviews.map(createCard).join('')}
      </div>
    </div>
    <div class="reviews-marquee reviews-marquee--left" aria-label="Kundenbewertungen - Reihe 2">
      <div class="reviews-track">
        ${bottomReviews.map(createCard).join('')}
        ${bottomReviews.map(createCard).join('')}
      </div>
    </div>
  `;
}

function renderProductReviews() {
  const page = document.querySelector('.product-page');
  if (!page) return;

  const marker = page.querySelector('.products-section--variants');
  if (!marker) return;
  if (page.querySelector('.reviews-section')) return;

  const fileName = window.location.pathname.split('/').pop() || '';
  const id = fileName.startsWith('produkt-') ? fileName.replace('produkt-', '').replace('.html', '') : '';
  const avg = PRODUCT_REVIEW_AVERAGE[id] || 4.7;
  const title = page.querySelector('.product-detail__content h2')?.textContent?.trim() || 'MerryMi';
  const productImage = page.querySelector('.product-detail__media img')?.getAttribute('src') || 'images/einweg-vape-merrymi-logo-merrymi.png';
  const variantPool = Array.from(page.querySelectorAll('.variants-gallery .variant-card')).map((card) => {
    const img = card.querySelector('img')?.getAttribute('src') || productImage;
    const name = card.querySelector('h3')?.textContent?.trim() || 'Variante';
    return { image: img, name };
  });

  const topReviews = HARD_CODED_REVIEWS.slice(0, 15);
  const bottomReviews = HARD_CODED_REVIEWS.slice(15);
  const buildDate = (index) => {
    const day = String(22 - (index % 20)).padStart(2, '0');
    return `${day}.03.2026`;
  };
  const buildRating = (index) => 4.7 + ((index % 4) * 0.1);

  const createCard = (review, index) => {
    const score = buildRating(index);
    const variant = variantPool.length
      ? variantPool[index % variantPool.length]
      : { image: productImage, name: 'Variante' };
    return `
      <article class="review-card review-card--product">
        <div class="review-card__top">
          <div class="review-card__reviewer">
            <p class="review-card__name">${review.author}</p>
            <span class="review-card__verified">✔ Verifizierter Kauf</span>
          </div>
          <p class="review-card__date">${buildDate(index)}</p>
          <div class="review-card__rating-line">
            <span class="review-card__stars">★★★★★</span>
            <span class="review-card__score">${score.toFixed(1)}/5</span>
          </div>
          <p class="review-card__text">“${review.text}”</p>
        </div>
        <div class="review-card__product">
          <img src="${variant.image}" alt="${variant.name}" loading="lazy">
          <p>${title} • ${variant.name}</p>
        </div>
      </article>
    `;
  };

  const section = document.createElement('section');
  section.className = 'reviews-section';
  section.innerHTML = `
    <div class="container">
      <div class="section-title section-title--center">
        <h2 id="reviews-title">Kundenbewertungen</h2>
      </div>
      <p class="reviews-summary">Durchschnittliche Bewertung von ${title}: <strong>${avg.toFixed(1)}/5</strong></p>

      <div class="reviews-marquee reviews-marquee--right" aria-label="Kundenbewertungen - Reihe 1">
        <div class="reviews-track">
          ${topReviews.map((review, index) => createCard(review, index)).join('')}
          ${topReviews.map((review, index) => createCard(review, index + topReviews.length)).join('')}
        </div>
      </div>

      <div class="reviews-marquee reviews-marquee--left" aria-label="Kundenbewertungen - Reihe 2">
        <div class="reviews-track">
          ${bottomReviews.map((review, index) => createCard(review, index + 100)).join('')}
          ${bottomReviews.map((review, index) => createCard(review, index + 100 + bottomReviews.length)).join('')}
        </div>
      </div>
    </div>
  `;

  page.insertBefore(section, marker);
}

const SITE_ORIGIN = 'https://merrymi.de';
const SITE_NAME = 'MerryMi';
const DEFAULT_DBUCHA_COLLECTION_URL = 'https://dezig.de/merrymi-kollektion-dezig/';
const DEFAULT_LOGO_PATH = 'images/einweg-vape-merrymi-logo-merrymi.png';

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCurrentFileName() {
  const rawPath = window.location.pathname || '/index.html';
  const path = rawPath.endsWith('/') ? `${rawPath}index.html` : rawPath;
  return path.split('/').pop() || 'index.html';
}

function getCanonicalUrl(fileName = getCurrentFileName()) {
  return fileName === 'index.html' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${fileName}`;
}

function toAbsoluteUrl(value, baseUrl = getCanonicalUrl()) {
  if (!value) return '';
  try {
    return new URL(value, baseUrl).href;
  } catch (_error) {
    return '';
  }
}

function upsertMeta(selector, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  return node;
}

function upsertLink(selector, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('link');
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  return node;
}

function replaceTag(element, newTagName) {
  if (!element || element.tagName.toLowerCase() === newTagName.toLowerCase()) return element;

  const replacement = document.createElement(newTagName);
  Array.from(element.attributes).forEach((attribute) => {
    replacement.setAttribute(attribute.name, attribute.value);
  });
  replacement.innerHTML = element.innerHTML;
  element.replaceWith(replacement);
  return replacement;
}

function getPageType(fileName = getCurrentFileName()) {
  if (fileName === 'index.html') return 'home';
  if (fileName === 'about-us.html') return 'about';
  if (fileName === 'products.html' || document.body.dataset.page === 'products') return 'products';
  if (fileName === 'product.html' || document.body.dataset.page === 'product-detail' || fileName.startsWith('produkt-') || document.querySelector('.product-page')) {
    return 'product';
  }
  return 'generic';
}

function getPageName() {
  const selectors = [
    '.product-detail__content h1',
    '.product-detail__content h2',
    '.about-us-hero__card h1',
    '.about-us-hero__card h2',
    '.products-section .section-title h1',
    '.products-section .section-title h2',
    '.hero-slide.is-active h1',
    '.hero-slide.is-active h2',
    '#hero-title'
  ];

  for (const selector of selectors) {
    const value = normalizeWhitespace(document.querySelector(selector)?.textContent);
    if (value) return value;
  }

  return normalizeWhitespace(document.title.replace(/\s+[–-]\s+MerryMi$/i, '')) || SITE_NAME;
}

function getPageDescription() {
  const metaDescription = normalizeWhitespace(document.querySelector('meta[name="description"]')?.getAttribute('content'));
  if (metaDescription) return metaDescription;

  const selectors = [
    '.product-detail__content > p',
    '.about-us-hero__card > p:last-of-type',
    '.faq-section__lead',
    '.hero-slide.is-active p'
  ];

  for (const selector of selectors) {
    const value = normalizeWhitespace(document.querySelector(selector)?.textContent);
    if (value) return value;
  }

  return `${SITE_NAME} präsentiert seine Modelle und Geschmackskollektionen mit Links zu den offiziellen Angeboten auf Dezig.de.`;
}

function getPageImage() {
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  if (ogImage) return ogImage;

  const selectors = [
    '.product-detail__media img',
    '.hero-slide.is-active img',
    '.catalog-card img',
    '.brand img',
    '.footer-brand img'
  ];

  for (const selector of selectors) {
    const src = document.querySelector(selector)?.getAttribute('src');
    if (src) return src;
  }

  return DEFAULT_LOGO_PATH;
}

function findDbuchaLink() {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  return anchors.find((anchor) => /dezig\.de/i.test(anchor.href))?.href || DEFAULT_DBUCHA_COLLECTION_URL;
}

function buildPageContext() {
  const fileName = getCurrentFileName();
  const pageType = getPageType(fileName);
  const pageName = getPageName();
  const canonicalUrl = getCanonicalUrl(fileName);
  const titleMap = {
    home: 'Startseite – MerryMi',
    about: 'Über uns – MerryMi',
    products: 'Produkte – MerryMi'
  };

  return {
    fileName,
    pageType,
    pageName,
    canonicalUrl,
    pageTitle: titleMap[pageType] || `${pageName} – MerryMi`,
    description: getPageDescription(),
    imageUrl: toAbsoluteUrl(getPageImage(), canonicalUrl),
    relatedUrl: findDbuchaLink()
  };
}

function patchExternalLinks() {
  const currentOrigin = window.location.origin || SITE_ORIGIN;

  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(href)) return;

    try {
      const url = new URL(href, currentOrigin);
      if (url.origin === currentOrigin) return;
      anchor.target = '_blank';
    } catch (_error) {
    }
  });
}

function ensureMainHeading(pageName) {
  const brand = document.querySelector('.brand');
  if (brand?.tagName === 'H1') {
    replaceTag(brand, 'div');
  }

  const pageType = getPageType();
  const selectorMap = {
    about: '.about-us-hero__card h2',
    products: '.products-section .section-title h2',
    product: '.product-detail__content h2'
  };
  const heading = document.querySelector(selectorMap[pageType] || '');
  if (heading) {
    replaceTag(heading, 'h1');
  }

  if (!document.querySelector('main h1')) {
    const main = document.querySelector('main');
    if (main) {
      const hiddenHeading = document.createElement('h1');
      hiddenHeading.className = 'sr-only';
      hiddenHeading.textContent = pageName;
      main.prepend(hiddenHeading);
    }
  }
}

function getItemListEntries(context) {
  const entries = [];

  const pushEntry = (name, url) => {
    const normalizedName = normalizeWhitespace(name);
    const normalizedUrl = normalizeWhitespace(url);
    if (!normalizedName || !normalizedUrl) return;
    if (entries.some((entry) => entry.name === normalizedName)) return;
    entries.push({ name: normalizedName, url: normalizedUrl });
  };

  if (context.pageType === 'home' || context.pageType === 'products') {
    document.querySelectorAll('.product-card, .catalog-card').forEach((card) => {
      const name = card.querySelector('h3')?.textContent;
      const url = card.querySelector('.cta-secondary-link, .section-cta-strip__secondary')?.getAttribute('href')
        || card.querySelector('a[href]')?.getAttribute('href');
      pushEntry(name, toAbsoluteUrl(url, context.canonicalUrl));
    });
  }

  if (context.pageType === 'product') {
    document.querySelectorAll('.variants-gallery .variant-card').forEach((card) => {
      const name = card.querySelector('h3')?.textContent;
      const url = card.querySelector('.variant-card__cta')?.getAttribute('href') || context.relatedUrl;
      pushEntry(name, toAbsoluteUrl(url, context.canonicalUrl));
    });
  }

  if (!entries.length) {
    document.querySelectorAll('.site-footer .footer-links a[href]').forEach((link) => {
      const name = normalizeWhitespace(link.textContent);
      if (!/^MerryMi\s/i.test(name)) return;

      const localHref = LOCAL_PRODUCT_LINKS[name];
      const fileName = localHref?.split('/').pop() || '';
      const productId = getProductIdFromDetailHref(fileName);
      const dbuchaHref = DBUCHA_PRODUCT_URLS[productId] || link.getAttribute('href');
      pushEntry(name, toAbsoluteUrl(dbuchaHref, context.canonicalUrl));
    });
  }

  return entries;
}

function buildGeneratedFaqItems(context, itemListEntries) {
  const visibleNames = itemListEntries.slice(0, 5).map((entry) => entry.name);
  const modelText = visibleNames.length ? visibleNames.join(', ') : context.pageName;
  const targetUrl = context.relatedUrl || DEFAULT_DBUCHA_COLLECTION_URL;
  const introMap = {
    home: `Dies ist eine Informationsseite von ${SITE_NAME}, auf der unsere Kollektionen und Modelle vorgestellt werden und Verknüpfungen zu den Angeboten auf Dezig.de bereitgestellt werden.`,
    about: `Dies ist die Informationsseite über die Marke ${SITE_NAME}, ihre Modelle und die auf unserer Website verfügbaren Inhalte.`,
    products: `Dies ist der Produktkatalog für ${SITE_NAME}-Modelle. Hier präsentieren wir unsere Vapes und verlinken direkt auf die aktuellen Angebote bei Dezig.de.`,
    product: `Dies ist die Informationsseite für das Modell ${context.pageName}, auf der die verfügbaren Geschmackssorten gezeigt und Kaufmöglichkeiten auf Dezig.de verlinkt werden.`
  };

  return [
    {
      question: 'Was ist der Zweck dieser Website?',
      answerHtml: `<p>${escapeHtml(introMap[context.pageType] || introMap.home)}</p>`
    },
    {
      question: 'Handelt es sich bei dieser Website um einen Online-Shop?',
      answerHtml: '<p>Nein. Dies ist eine reine Informationsseite zur Vorstellung der MerryMi-Modelle. Aktuelle Produkte und Bestellmöglichkeiten sind direkt über die Verlinkungen auf Dezig.de verfügbar.</p>'
    },
    {
      question: 'Welche Modelle oder Kollektionen werden präsentiert?',
      answerHtml: `<p>Auf dieser Seite werden unter anderem folgende Modelle vorgestellt: ${escapeHtml(modelText)}.</p>`
    },
    {
      question: 'Wo kann ich diese Produkte erwerben?',
      answerHtml: `<p>Das aktuelle Sortiment kann über die integrierten Produktlinks direkt auf <a href="${escapeHtml(targetUrl)}" target="_blank">Dezig.de</a> eingesehen und bestellt werden.</p>`
    },
    {
      question: 'Für wen sind die Inhalte dieser Website bestimmt?',
      answerHtml: '<p>Die Inhalte richten sich ausschließlich an volljährige Personen (18+), die sich über MerryMi-Modelle und allgemeine Informationen zu nikotinhaltigen E-Zigaretten informieren möchten.</p>'
    }
  ];
}

function ensureFaqSection(context, itemListEntries) {
  if (document.querySelector('.faq-section')) return;

  const main = document.querySelector('main');
  if (!main) return;

  const faqItems = buildGeneratedFaqItems(context, itemListEntries);
  const section = document.createElement('section');
  section.className = 'faq-section';
  section.id = 'faq';
  section.setAttribute('aria-labelledby', 'generated-faq-title');
  section.innerHTML = `
    <div class="container">
      <div class="section-title section-title--center">
        <h2 id="generated-faq-title">FAQ</h2>
      </div>
      <div class="faq-grid">
        ${faqItems.map((item, index) => `
          <details class="faq-item"${index === 0 ? ' open' : ''}>
            <summary>${escapeHtml(item.question)}</summary>
            ${item.answerHtml}
          </details>
        `).join('')}
      </div>
    </div>
  `;

  main.appendChild(section);
}

function updateHeadMetadata(context) {
  document.documentElement.setAttribute('lang', 'de');
  document.title = context.pageTitle;

  document.querySelectorAll('meta[name="keywords"], meta[name="title"]').forEach((node) => node.remove());

  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: context.canonicalUrl });
  upsertMeta('meta[name="description"]', { name: 'description', content: context.description });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: context.canonicalUrl });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: context.pageTitle });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: context.description });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: context.imageUrl });
  upsertMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: context.imageUrl });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'de_DE' });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: context.pageTitle });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: context.description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: context.imageUrl });
}

function normalizeImages() {
  document.querySelectorAll('img').forEach((img, index) => {
    if (!img.getAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    if (!normalizeWhitespace(img.getAttribute('alt'))) {
      const fallbackAlt = normalizeWhitespace(
        img.closest('article, section, div')?.querySelector('h1, h2, h3, p')?.textContent
      ) || SITE_NAME;
      img.setAttribute('alt', fallbackAlt);
    }

    const shouldLazyLoad = index > 1
      && !img.closest('.hero-slide.is-active')
      && !img.closest('.brand')
      && !img.closest('.product-detail__media');

    if (shouldLazyLoad && !img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  patchExternalLinks();

  const initialContext = buildPageContext();
  ensureMainHeading(initialContext.pageName);

  const context = buildPageContext();
  const itemListEntries = getItemListEntries(context);
  ensureFaqSection(context, itemListEntries);

  const finalContext = buildPageContext();
  updateHeadMetadata(finalContext);
  normalizeImages();
});

const promoCopyButton = document.querySelector('[data-promo-copy]');
const promoCodeEl = document.querySelector('[data-promo-code]');

if (promoCopyButton && promoCodeEl) {
  promoCopyButton.addEventListener('click', async () => {
    const code = promoCodeEl.textContent?.trim() || 'LIP7';

    try {
      await navigator.clipboard.writeText(code);
      const original = promoCopyButton.textContent;
      promoCopyButton.textContent = 'Kopiert';
      window.setTimeout(() => {
        promoCopyButton.textContent = original;
      }, 1500);
    } catch (_error) {
      promoCopyButton.textContent = 'Code: LIP7';
      window.setTimeout(() => {
        promoCopyButton.textContent = 'Code kopieren';
      }, 1500);
    }
  });
}
