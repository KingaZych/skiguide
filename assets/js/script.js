const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const currentYear = document.getElementById("currentYear");

function updateHeader() {
    siteHeader.classList.toggle("scrolled", window.scrollY > 100);
}

function closeMenu() {
    mainNav.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", event => {
    if (window.innerWidth <= 900 && mainNav.classList.contains("active") && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
});

if (currentYear) currentYear.textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}


// Partners carousel - homepage only
const partnersTrack = document.getElementById("partnersTrack");

if (partnersTrack) {
    const partnerItems = Array.from(partnersTrack.children);
    let partnerIndex = 0;
    let partnerTimer;

    function partnerSlidesPerView() {
        if (window.innerWidth <= 620) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function updatePartnersCarousel() {
        const perView = partnerSlidesPerView();
        const maxIndex = Math.max(0, partnerItems.length - perView);
        partnerIndex = Math.min(partnerIndex, maxIndex);

        const first = partnerItems[0];
        if (!first) return;
        const gap = 16;
        const step = first.getBoundingClientRect().width + gap;
        partnersTrack.style.transform = `translateX(${-partnerIndex * step}px)`;
    }

    function movePartners(direction = 1) {
        const maxIndex = Math.max(0, partnerItems.length - partnerSlidesPerView());
        if (maxIndex === 0) return;
        partnerIndex += direction;
        if (partnerIndex > maxIndex) partnerIndex = 0;
        if (partnerIndex < 0) partnerIndex = maxIndex;
        updatePartnersCarousel();
    }

    function startPartnersAutoplay() {
        window.clearInterval(partnerTimer);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        partnerTimer = window.setInterval(() => movePartners(1), 3200);
    }

    window.addEventListener("resize", updatePartnersCarousel);
    updatePartnersCarousel();
    startPartnersAutoplay();
}


// Location photo carousels - locations subpage only
const locationCarousels = document.querySelectorAll("[data-location-carousel]");

if (locationCarousels.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    locationCarousels.forEach((carousel, carouselIndex) => {
        const slides = Array.from(carousel.querySelectorAll(":scope > img"));
        if (slides.length < 2 || reduceMotion) return;

        let activeIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains("is-active")));
        if (!slides[activeIndex]) activeIndex = 0;
        slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeIndex));

        const interval = 5400 + (carouselIndex % 3) * 450;
        const startDelay = carouselIndex * 700;

        window.setTimeout(() => {
            window.setInterval(() => {
                slides[activeIndex].classList.remove("is-active");
                activeIndex = (activeIndex + 1) % slides.length;
                slides[activeIndex].classList.add("is-active");
            }, interval);
        }, startDelay);
    });
}


// Compact language flag selector: hover on desktop, click on touch/mobile.
document.querySelectorAll('.language-flags').forEach((switcher) => {
    const trigger = switcher.querySelector('.language-current');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = switcher.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(open));
    });

    switcher.addEventListener('mouseleave', () => {
        switcher.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.language-flags.is-open').forEach((switcher) => {
        switcher.classList.remove('is-open');
        const trigger = switcher.querySelector('.language-current');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
});


// About page: replace old statistics with a panoramic photo, contour texture and parallax.
const aboutNumbersSection = document.querySelector('.about-numbers-section');

if (aboutNumbersSection) {
    const terrainStyles = document.createElement('link');
    terrainStyles.rel = 'stylesheet';
    terrainStyles.href = new URL('../css/terrain.css', document.currentScript.src).href;
    document.head.appendChild(terrainStyles);

    const routeSection = document.createElement('section');
    routeSection.className = 'about-route-section reveal';
    routeSection.setAttribute('aria-label', 'Mountain panorama with topographic contour lines');
    routeSection.innerHTML = `
        <div class="about-route-photo" aria-hidden="true"></div>
        <div class="about-route-overlay" aria-hidden="true"></div>
        <svg class="about-contours" viewBox="0 0 1400 360" preserveAspectRatio="none" aria-hidden="true">
            <g class="about-contour-lines">
                <path d="M-40 58 C120 10 235 95 395 52 S690 6 880 64 S1170 120 1450 42" />
                <path d="M-30 78 C130 32 250 116 410 72 S705 28 900 84 S1185 140 1440 65" />
                <path d="M-20 100 C145 56 270 140 430 94 S730 52 925 106 S1210 160 1430 90" />
                <path d="M-10 124 C160 84 290 164 455 120 S750 80 955 130 S1230 182 1420 116" />
                <path d="M0 150 C170 112 310 190 480 146 S775 106 985 156 S1250 204 1410 144" />
                <path d="M10 178 C190 142 335 218 510 176 S805 138 1015 184 S1270 226 1400 174" />
                <path d="M20 208 C210 174 365 246 545 206 S840 170 1045 214 S1295 250 1390 206" />
                <path d="M30 240 C225 208 390 276 580 238 S875 205 1080 244 S1320 272 1380 240" />
                <path d="M40 274 C250 244 420 310 620 272 S920 238 1110 278 S1335 296 1370 278" />
                <path d="M55 308 C280 280 460 338 655 306 S950 276 1140 314 S1345 322 1360 316" />
            </g>
        </svg>
        <div class="about-route-meta" aria-hidden="true">
            <span>2400 m</span>
            <span>2800 m</span>
            <span>3200 m</span>
        </div>
        <span class="about-route-brand">SKIGUIDE.INFO</span>`;

    aboutNumbersSection.replaceWith(routeSection);

    if ('IntersectionObserver' in window) {
        const routeObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    routeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });
        routeObserver.observe(routeSection);
    } else {
        routeSection.classList.add('visible');
    }

    const routePhoto = routeSection.querySelector('.about-route-photo');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (routePhoto && !reduceMotion) {
        let ticking = false;

        const updateParallax = () => {
            const rect = routeSection.getBoundingClientRect();
            const viewport = window.innerHeight || document.documentElement.clientHeight;
            const progress = (viewport - rect.top) / (viewport + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            const translate = (clamped - 0.5) * 56;
            routePhoto.style.transform = `translate3d(0, ${translate}px, 0) scale(1.09)`;
            ticking = false;
        };

        const requestParallax = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallax, { passive: true });
        window.addEventListener('resize', requestParallax);
        updateParallax();
    }
}
