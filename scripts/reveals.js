/**
 * GCT Website - Scroll Reveal Animations
 * Handles intersection observer-based animations
 */

class ScrollReveals {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.15,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            ...options
        };

        this.elements = document.querySelectorAll('[data-reveal]');
        this.observer = null;

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
            this.observeElements();
        } else {
            // Fallback: show all elements immediately
            this.revealAll();
        }
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
    }

    observeElements() {
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }

    revealElement(el) {
        el.classList.add('revealed');
    }

    revealAll() {
        this.elements.forEach(el => {
            el.classList.add('revealed');
        });
    }

    // Method to add new elements dynamically
    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        }
    }
}

/**
 * Text reveal animation - splits text into spans
 */
class TextReveal {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = `<span class="text-reveal__inner">${text}</span>`;
        });
    }
}

/**
 * Character-by-character reveal
 */
class CharacterReveal {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            const chars = text.split('');

            el.innerHTML = chars.map((char, i) => {
                const delay = i * 30; // 30ms between each character
                return char === ' '
                    ? ' '
                    : `<span class="char" style="transition-delay: ${delay}ms">${char}</span>`;
            }).join('');
        });
    }
}

/**
 * Scroll Progress Bar
 */
class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.bindEvents();
        this.updateProgress();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
        window.addEventListener('resize', () => this.updateProgress(), { passive: true });
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        this.progressBar.style.width = `${progress}%`;
    }
}

/**
 * Parallax effect for background elements
 */
class ParallaxEffect {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        this.ticking = false;

        if (this.layers.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateLayers();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateLayers() {
        const scrollY = window.scrollY;

        this.layers.forEach(layer => {
            const speed = layer.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// Initialize all reveal effects
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Initialize scroll reveals
        new ScrollReveals();

        // Initialize text reveals
        new TextReveal('.text-reveal');

        // Initialize scroll progress bar
        new ScrollProgress();

        // Initialize parallax
        new ParallaxEffect();
    } else {
        // Just show everything without animation
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('revealed');
        });
        document.querySelectorAll('.text-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollReveals, TextReveal, CharacterReveal, ScrollProgress, ParallaxEffect };
}
