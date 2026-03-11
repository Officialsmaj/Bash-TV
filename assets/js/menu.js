/**
 * Bash TV Media - Mobile Menu
 * Handles mobile navigation menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

/**
 * Initialize Mobile Menu
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update icon
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Add smooth scroll to menu links
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Sticky Navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    initStickyNav();
});

function initStickyNav() {
    const nav = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (!nav) return;
    
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > scrollThreshold) {
            nav.classList.add('sticky');
            if (header) {
                header.classList.add('nav-sticky');
            }
        } else {
            nav.classList.remove('sticky');
            if (header) {
                header.classList.remove('nav-sticky');
            }
        }
        
        lastScroll = currentScroll;
    });
}

