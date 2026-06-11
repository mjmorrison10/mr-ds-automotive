// Mr D's Automotive - Interactive Scripts

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
}

window.addEventListener('scroll', updateScrollProgress);

const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
}

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', toggleBackToTop);

function animateCounter(element, target, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        element.textContent = target >= 1000 ? current.toLocaleString() + '+' : current + '+';
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function fadeInElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.5)';
    element.style.transition = 'all 0.6s ease';
    requestAnimationFrame(() => { element.style.opacity = '1'; element.style.transform = 'scale(1)'; });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const count = el.getAttribute('data-count');
            if (count !== null) {
                const target = parseInt(count, 10);
                if (!isNaN(target) && target > 0) { el.classList.add('counting'); animateCounter(el, target, 2000); }
                else fadeInElement(el);
            } else fadeInElement(el);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-number[data-count]').forEach(el => statsObserver.observe(el));

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = Array.from(parent.children).filter(child =>
                child.classList.contains('service-card') || child.classList.contains('review-card') ||
                child.classList.contains('why-feature') || child.classList.contains('detail-card')
            );
            const delay = siblings.indexOf(entry.target) >= 0 ? siblings.indexOf(entry.target) * 0.1 : 0;
            entry.target.style.animationDelay = delay + 's';
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .review-card, .why-feature, .detail-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

const heroContent = document.querySelector('.hero-content');
function parallaxHero() {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrolled < heroHeight) heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
}
window.addEventListener('scroll', parallaxHero);

function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('hero-particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (3 + Math.random() * 3) + 's';
        particle.style.width = (4 + Math.random() * 6) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}
createParticles();

let autoScrollInterval = null;
function startAutoScroll() {
    const rg = document.getElementById('reviewsGrid');
    if (!rg || window.innerWidth >= 768) return;
    let dir = 1;
    autoScrollInterval = setInterval(() => {
        const max = rg.scrollWidth - rg.clientWidth;
        if (rg.scrollLeft >= max - 2) dir = -1;
        else if (rg.scrollLeft <= 2) dir = 1;
        rg.scrollLeft += dir;
    }, 30);
}
function stopAutoScroll() { if (autoScrollInterval) { clearInterval(autoScrollInterval); autoScrollInterval = null; } }
function checkAutoScroll() { if (window.innerWidth < 768) { if (!autoScrollInterval) startAutoScroll(); } else stopAutoScroll(); }
const rg = document.getElementById('reviewsGrid');
if (rg) {
    rg.addEventListener('touchstart', stopAutoScroll);
    rg.addEventListener('touchend', () => setTimeout(() => { if (window.innerWidth < 768) startAutoScroll(); }, 3000));
}
window.addEventListener('resize', checkAutoScroll);
checkAutoScroll();

const contactForm = document.getElementById('contactForm');
const formFields = contactForm.querySelectorAll('input, select, textarea');

formFields.forEach(field => {
    field.addEventListener('input', function() {
        const fg = this.closest('.form-group');
        if (this.value.trim().length > 0) fg.classList.add('valid'); else fg.classList.remove('valid');
    });
    field.addEventListener('blur', function() {
        const fg = this.closest('.form-group');
        if (this.hasAttribute('required') && this.value.trim().length === 0) fg.classList.remove('valid');
    });
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    const subject = encodeURIComponent(`Appointment Request - ${data.make || 'Vehicle'} ${data.year || ''}`);
    const body = encodeURIComponent(`Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || 'N/A'}\nVehicle: ${data.make || 'N/A'} ${data.year || ''}\nService: ${data.service || 'N/A'}\nIssue: ${data.message || 'N/A'}\n\nPlease call me to schedule an appointment.`);
    window.location.href = `mailto:info@mrdsautomotive.com?subject=${subject}&body=${body}`;
    const btn = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '&#10003; Request Sent!';
    btn.style.background = '#10b981'; btn.style.borderColor = '#10b981';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; this.reset(); formFields.forEach(f => f.closest('.form-group').classList.remove('valid')); }, 3000);
});

setTimeout(() => document.querySelectorAll('.hero-ctas .btn').forEach(b => b.classList.add('btn-pulse')), 3000);

const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a[data-section]');
function updateActiveNav() {
    const sp = window.scrollY + 120;
    sections.forEach(s => {
        const id = s.getAttribute('id');
        if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight)
            navLinksList.forEach(l => { l.classList.remove('active-section'); if (l.getAttribute('data-section') === id) l.classList.add('active-section'); });
    });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => { if (typeof gtag === 'function') gtag('event', 'click_to_call', { business: "Mr D's Automotive" }); });
});

window.addEventListener('load', () => {
    const els = ['.hero-badge', '.hero h1', '.hero-sub', '.hero-ctas', '.hero-trust'];
    els.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; setTimeout(() => { el.style.transition = 'all 0.6s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 200 + i * 200); }
    });
    updateScrollProgress();
});