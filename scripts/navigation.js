/**
 * GCT Website - Navigation Component
 * Handles side navigation behavior and mobile bottom nav
 */

class Navigation {
  constructor() {
    this.sideNavLinks = document.querySelectorAll('.side-nav__link');
    this.bottomNavLinks = document.querySelectorAll('.bottom-nav__link');
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';

    this.init();
  }

  init() {
    this.setActiveLinks();
    this.initDropdowns();
  }

  setActiveLinks() {
    // Set active state for side nav links
    this.sideNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPage = href.split('/').pop();

      if (linkPage === this.currentPage) {
        link.classList.add('side-nav__link--active');
      }
    });

    // Set active state for bottom nav links
    this.bottomNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPage = href.split('/').pop();

      if (linkPage === this.currentPage) {
        link.classList.add('bottom-nav__link--active');
      }
    });
  }

  initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.side-nav__link--dropdown');

    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.closest('.side-nav__item--dropdown');
        parent.classList.toggle('side-nav__item--open');
      });
    });
  }
}

/**
 * Generate Navigation HTML
 */
function generateNavigation() {
  // Determine root path based on current location
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length;
  // Adjust depth calculation based on local file system vs server
  // For local files, we need to be careful. A simple heuristic:
  // if path contains 'divisions', go back one level.
  const isDivision = path.includes('/divisions/');
  const rootPath = isDivision ? '../' : '';

  const navItems = [
    { href: rootPath + 'index.html', icon: 'home', label: 'Foundation' },
    { href: rootPath + 'legacy.html', icon: 'info', label: 'Legacy' },
    {
      href: rootPath + 'pathways.html',
      icon: 'book',
      label: 'Pathways',
      dropdown: [
        { href: rootPath + 'divisions/computing.html', label: 'Computer Information Technology' },
        { href: rootPath + 'divisions/electrical.html', label: 'Electrical Technology' },
        { href: rootPath + 'divisions/machinery.html', label: 'Mechanical Technology' },
        { href: rootPath + 'divisions/construction.html', label: 'Civil Technology' },
        { href: rootPath + 'divisions/circuits.html', label: 'Electronics Technology' }
      ]
    },
    { href: rootPath + 'enrollment.html', icon: 'user-plus', label: 'Enrollment' },
    { href: rootPath + 'chronicle.html', icon: 'camera', label: 'Campus Life' },
    { href: rootPath + 'connect.html', icon: 'mail', label: 'Connect' }
  ];

  const icons = {
    home: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    book: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    'user-plus': `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    camera: `<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    mail: `<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>`
  };

  const linksHTML = navItems.map(item => {
    if (item.dropdown) {
      const dropdownItems = item.dropdown.map(dropItem =>
        `<a href="${dropItem.href}" class="side-nav__dropdown-link">${dropItem.label}</a>`
      ).join('');

      return `
        <div class="side-nav__item side-nav__item--has-dropdown">
          <a href="${item.href}" class="side-nav__link">
            <span class="side-nav__icon">${icons[item.icon]}</span>
            <span class="side-nav__label">${item.label}</span>
          </a>
          <div class="side-nav__dropdown-panel">
            <div class="side-nav__dropdown-title">Academic Programs</div>
            ${dropdownItems}
          </div>
        </div>
      `;
    }
    return `
      <a href="${item.href}" class="side-nav__link">
        <span class="side-nav__icon">${icons[item.icon]}</span>
        <span class="side-nav__label">${item.label}</span>
      </a>
    `;
  }).join('');

  // Generate bottom nav links for mobile
  const bottomNavHTML = navItems.map(item => `
    <a href="${item.href}" class="bottom-nav__link">
      <span class="bottom-nav__icon">${icons[item.icon]}</span>
      <span class="bottom-nav__label">${item.label}</span>
    </a>
  `).join('');

  return `
    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav" aria-label="Mobile Navigation">
      ${bottomNavHTML}
    </nav>

    <!-- Desktop Side Navigation -->
    <nav class="side-nav" aria-label="Main Navigation">
      <div class="side-nav__logo">
        <img src="${rootPath}images/GCT-Logo.png" alt="GCT Logo" class="side-nav__logo-img">
      </div>
      <div class="side-nav__menu">
        ${linksHTML}
      </div>
    </nav>
  `;
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  // Insert navigation at the start of body
  document.body.insertAdjacentHTML('afterbegin', generateNavigation());

  // Initialize navigation behavior
  new Navigation();

  // Initialize back to top button
  initBackToTop();

  // Generate and insert footer
  generateFooter();
});

/**
 * Footer Generation
 */
function generateFooter() {
  const currentYear = new Date().getFullYear();

  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="row g-4">
          <!-- About Section -->
          <div class="col-lg-3 col-md-6">
            <h3 class="footer__heading">About GCT</h3>
            <p class="footer__text">
              Government College of Technology, Bhakkar provides quality technical education through PBTE-approved diploma programs, preparing students for successful careers in engineering and technology.
            </p>
          </div>

          <!-- Academic Divisions -->
          <div class="col-lg-3 col-md-6">
            <h3 class="footer__heading">Academic Divisions</h3>
            <ul class="footer__links">
              <li><a href="${rootPath}divisions/computing.html">Computer Information Technology</a></li>
              <li><a href="${rootPath}divisions/electrical.html">Electrical Technology</a></li>
              <li><a href="${rootPath}divisions/machinery.html">Mechanical Technology</a></li>
              <li><a href="${rootPath}divisions/construction.html">Civil Technology</a></li>
              <li><a href="${rootPath}divisions/circuits.html">Electronics Technology</a></li>
            </ul>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-3 col-md-6">
            <h3 class="footer__heading">Quick Links</h3>
            <ul class="footer__links">
              <li><a href="${rootPath}index.html">Home</a></li>
              <li><a href="${rootPath}legacy.html">Legacy</a></li>
              <li><a href="${rootPath}pathways.html">Programs</a></li>
              <li><a href="${rootPath}enrollment.html">Admissions</a></li>
              <li><a href="${rootPath}chronicle.html">Campus Life</a></li>
              <li><a href="${rootPath}connect.html">Contact Us</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-3 col-md-6">
            <h3 class="footer__heading">Contact Information</h3>
            <ul class="footer__contact">
              <li>
                <svg class="footer__icon" viewBox="0 0 24 24" width="14" height="14">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Main Road, Bhakkar, Punjab, Pakistan</span>
              </li>
              <li>
                <svg class="footer__icon" viewBox="0 0 24 24" width="14" height="14">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+92 (453) 123456</span>
              </li>
              <li>
                <svg class="footer__icon" viewBox="0 0 24 24" width="14" height="14">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@gctbhakkar.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer__bottom">
          <p class="footer__copyright">
            © ${currentYear} Government College of Technology, Bhakkar. All rights reserved.
          </p>
          <p class="footer__credits">
            Affiliated with <strong>Punjab Board of Technical Education (PBTE)</strong>
          </p>
        </div>
      </div>
    </footer>
  `;

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = footerHTML;
  }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(btn);

  // Show/hide based on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Navigation, generateNavigation };
}
