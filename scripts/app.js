/**
 * GCT Website - Main Application
 * Core initialization and utilities
 */

// DOM Ready helper
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Page Loader
 */
class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');

        if (this.loader) {
            this.init();
        }
    }

    init() {
        // If page is already loaded
        if (document.readyState === 'complete') {
            this.hide();
            return;
        }

        // Standard load event
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });

        // Fallback: Force hide after 3 seconds max
        setTimeout(() => {
            if (!this.loader.classList.contains('hidden')) {
                this.hide();
            }
        }, 3000);
    }

    hide() {
        this.loader.classList.add('hidden');

        // Remove from DOM after transition
        setTimeout(() => {
            this.loader.remove();
        }, 500);
    }
}

/**
 * Counter Animation
 */
class CounterAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.dataset.target) || 0;
        this.duration = options.duration || 2000;
        this.started = false;

        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.started) {
                    this.started = true;
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const start = 0;
        const end = this.target;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);

            this.element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.element.textContent = end.toLocaleString();

                // Add suffix if exists
                const suffix = this.element.dataset.suffix || '';
                if (suffix) {
                    this.element.textContent += suffix;
                }
            }
        };

        requestAnimationFrame(update);
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form validation and submission
 */
function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const inputs = this.querySelectorAll('[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Handle form submission
                const formData = new FormData(this);
                console.log('Form submitted:', Object.fromEntries(formData));

                // Show success message
                const successMsg = this.querySelector('.form-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                }

                // Reset form
                this.reset();
            }
        });
    });
}

/**
 * Initialize all page functionality
 */
ready(() => {
    // Page loader
    new PageLoader();

    // Initialize counters
    document.querySelectorAll('[data-counter]').forEach(el => {
        new CounterAnimation(el);
    });

    // Smooth scroll
    initSmoothScroll();

    // Forms
    initForms();

    // FAQ Accordion
    initFAQ();

    // Testimonials Carousel
    initTestimonialCarousel();

    // Log initialization
    console.log('GCT Website initialized successfully');
});

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                // Toggle current
                item.classList.toggle('open');
            });
        }
    });
}

/**
 * Testimonials Carousel
 */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Auto-rotate every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);
}

/**
 * Generate Footer HTML
 */
function generateFooter() {
    const currentYear = new Date().getFullYear();

    return `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <h3 style="color: var(--color-ivory); font-size: var(--text-2xl);">
              Government College<br>of Technology
            </h3>
            <p class="footer__brand-text">
              Cultivating excellence in technical education since establishment. 
              Empowering students with practical skills and innovative thinking.
            </p>
          </div>
          
          <div class="footer__column">
            <h4 class="footer__heading">Navigation</h4>
            <ul class="footer__links">
              <li><a href="index.html" class="footer__link">Foundation</a></li>
              <li><a href="heritage.html" class="footer__link">Institutional Heritage</a></li>
              <li><a href="pathways.html" class="footer__link">Academic Pathways</a></li>
              <li><a href="enrollment.html" class="footer__link">Enrollment Gateway</a></li>
            </ul>
          </div>
          
          <div class="footer__column">
            <h4 class="footer__heading">Divisions</h4>
            <ul class="footer__links">
              <li><a href="divisions/computing.html" class="footer__link">Computing Division</a></li>
              <li><a href="divisions/electrical.html" class="footer__link">Electrical Division</a></li>
              <li><a href="divisions/machinery.html" class="footer__link">Machinery Division</a></li>
              <li><a href="divisions/construction.html" class="footer__link">Construction Division</a></li>
            </ul>
          </div>
          
          <div class="footer__column">
            <h4 class="footer__heading">Reach Us</h4>
            <ul class="footer__links">
              <li><a href="connect.html" class="footer__link">Contact Information</a></li>
              <li><a href="chronicle.html" class="footer__link">Campus Chronicle</a></li>
              <li><a href="#" class="footer__link">Student Resources</a></li>
              <li><a href="#" class="footer__link">Academic Calendar</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p class="footer__copyright">
            © ${currentYear} Government College of Technology, Bhakkar. All rights reserved.
          </p>
          
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Insert footer
ready(() => {
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = generateFooter();
    } else {
        // Append footer to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforeend', generateFooter());
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PageLoader, CounterAnimation, generateFooter };
}
