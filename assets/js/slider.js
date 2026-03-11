/**
 * Bash TV Media - Hero News Slider
 * Handles the hero section slider functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});

/**
 * Initialize Hero Slider
 */
function initHeroSlider() {
    const sliderWrapper = document.querySelector('.hero-slider-wrapper');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!sliderWrapper || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;
        
        // Move slider
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        // Update active slide class
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderWrapper.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Initialize first slide
    goToSlide(0);
}

/**
 * Breaking News Ticker
 */
document.addEventListener('DOMContentLoaded', function() {
    initBreakingNewsTicker();
});

function initBreakingNewsTicker() {
    const ticker = document.querySelector('.breaking-ticker ul');
    
    if (!ticker) return;
    
    // Clone items for seamless loop
    const items = ticker.querySelectorAll('li');
    if (items.length > 0) {
        const itemsClone = items.clone();
        ticker.appendChild(...itemsClone);
    }
}

