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


// About page: replace the old statistics strip with a visual ski-route panorama.
const aboutNumbersSection = document.querySelector('.about-numbers-section');

if (aboutNumbersSection) {
    const terrainStyles = document.createElement('link');
    terrainStyles.rel = 'stylesheet';
    terrainStyles.href = new URL('../css/terrain.css', document.currentScript.src).href;
    document.head.appendChild(terrainStyles);

    const routeSection = document.createElement('section');
    routeSection.className = 'about-route-section reveal';
    routeSection.setAttribute('aria-label', 'Panoramic mountain route');
    routeSection.innerHTML = `
        <div class="about-route-inner">
            <span class="about-route-brand">SKIGUIDE.INFO</span>
            <svg class="about-route-map" viewBox="0 0 1200 260" role="img" aria-label="Stylised ski route across mountain terrain">
                <path class="about-route-line-glow" d="M55 172 C150 142 225 190 315 158 S445 102 550 136 S690 176 790 118 S955 82 1140 150" />
                <path class="about-route-line" d="M55 172 C150 142 225 190 315 158 S445 102 550 136 S690 176 790 118 S955 82 1140 150" />

                <circle class="about-route-point" cx="55" cy="172" r="8" />
                <circle class="about-route-point" cx="315" cy="158" r="8" />
                <circle class="about-route-point" cx="790" cy="118" r="8" />
                <circle class="about-route-point" cx="1140" cy="150" r="8" />

                <text class="about-route-label" x="55" y="142">START</text>
                <text class="about-route-altitude" x="55" y="160">2 280 m</text>

                <text class="about-route-label" x="315" y="126">PASS</text>
                <text class="about-route-altitude" x="315" y="144">2 640 m</text>

                <text class="about-route-label" x="790" y="84">SUMMIT</text>
                <text class="about-route-altitude" x="790" y="102">3 126 m</text>

                <text class="about-route-label" x="1060" y="184">FINISH</text>
                <text class="about-route-altitude" x="1060" y="202">1 460 m</text>
            </svg>
        </div>`;

    aboutNumbersSection.replaceWith(routeSection);

    if ('IntersectionObserver' in window) {
        const routeObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    routeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        routeObserver.observe(routeSection);
    } else {
        routeSection.classList.add('visible');
    }
}
