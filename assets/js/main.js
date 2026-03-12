/**
 * Bash TV Media - Main JavaScript
 * Contains main functionality for the news website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initDarkMode();
    initScrollToTop();
    initLazyLoading();
    initSearchFunction();
    initImageHoverEffects();
    initHeaderScroll();
});

/**
 * Dark Mode Toggle
 */
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('bashtv-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('bashtv-theme', isDark ? 'dark' : 'light');
            updateDarkModeIcon(isDark);
        });
    }
}

function updateDarkModeIcon(isDark) {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');

    if (!scrollTopBtn) return;

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollTopBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollTopBtn.click();
        }
    });
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(function(img) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Search Functionality
 */
function initSearchFunction() {
    const searchInput = document.querySelector('.header-search input');
    const searchBtn = document.querySelector('.header-search button');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim() === '') {
        alert('Don shigar da kalmar bincike');
        return;
    }
    // In a real application, this would redirect to search results
    console.log('Searching for:', query);
    alert('Bincike: ' + query);
}

/**
 * Image Hover Effects
 */
function initImageHoverEffects() {
    const cards = document.querySelectorAll('.news-card, .video-card, .facebook-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Format Date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ha-NG', options);
}

/**
 * Truncate Text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text(0, maxLength) + '.substr...';
}

