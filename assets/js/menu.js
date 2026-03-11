/**
 * Bash TV Media - Navigation & Menu
 * Handles the primary navigation bar and mobile menu.
 */

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initStickyNav();
});

/**
 * Initializes the mobile menu toggle, accessible labels and active link states.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (!menuToggle || !mobileMenu) return;

    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');

    const mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');

    menuToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        toggleMenu();
    });

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleMenu(false);
        });
    }

    function toggleMenu(forceOpen) {
        const isOpen = typeof forceOpen === 'boolean'
            ? forceOpen
            : !mobileMenu.classList.contains('active');

        mobileMenu.classList.toggle('active', isOpen);
        body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        updateMenuIcon(isOpen);
    }

    function updateMenuIcon(isActive) {
        const icon = menuToggle.querySelector('i');
        if (!icon) return;
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-times', isActive);
    }

    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            toggleMenu(false);
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) {
            toggleMenu(false);
        }
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            toggleMenu(false);
        });
    });

    setActiveNavLinks();
}

/**
 * Adds the sticky behavior to the desktop navigation and highlights the right link.
 */
function initStickyNav() {
    const nav = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    if (!nav) return;

    window.addEventListener('scroll', function () {
        const shouldStick = window.pageYOffset > 100;
        nav.classList.toggle('sticky', shouldStick);
        header?.classList.toggle('nav-sticky', shouldStick);
    });
}

/**
 * Sets the active class on the current page link.
 */
function setActiveNavLinks() {
    const links = document.querySelectorAll('.nav-menu .nav-list a, .mobile-menu ul li a');
    const pathname = window.location.pathname.split('/').pop() || 'index.html';
    const normalizedCurrent = pathname.split('?')[0];

    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const normalizedHref = href.split('?')[0].split('/').pop();
        if (normalizedHref === normalizedCurrent || (normalizedHref === 'index.html' && normalizedCurrent === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
