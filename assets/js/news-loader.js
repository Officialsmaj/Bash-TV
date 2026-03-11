/**
 * Bash TV Media - News Loader
 * Handles loading and displaying news from JSON data
 */

// Global news data
let newsData = [];
let filteredNews = [];

/**
 * Initialize news loader
 */
document.addEventListener('DOMContentLoaded', function() {
    loadNewsData();
});

/**
 * Load news data from JSON file
 */
async function loadNewsData() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) {
            throw new Error('Failed to load news data');
        }
        newsData = await response.json();
        filteredNews = [...newsData];
        
        // Initialize news sections
        displayTopStories();
        displayLatestNews();
        displayTrendingNews();
        displayPopularNews();
        displayVideoNews();
        displayCategoryNews();
        
    } catch (error) {
        console.error('Error loading news:', error);
        // Display sample news if JSON fails
        displaySampleNews();
    }
}

/**
 * Display Top Stories
 */
function displayTopStories() {
    const container = document.querySelector('.news-grid');
    if (!container) return;
    
    const topStories = newsData.filter(news => news.featured).slice(0, 4);
    
    if (topStories.length === 0) {
        container.innerHTML = '<p class="loading-spinner">Loading...</p>';
        return;
    }
    
    container.innerHTML = topStories.map(news => createNewsCard(news)).join('');
}

/**
 * Display Latest News
 */
function displayLatestNews() {
    const container = document.querySelector('.news-list');
    if (!container) return;
    
    const latestNews = newsData.slice(0, 5);
    
    if (latestNews.length === 0) {
        container.innerHTML = '<p class="loading-spinner">Loading...</p>';
        return;
    }
    
    container.innerHTML = latestNews.map(news => createNewsListItem(news)).join('');
}

/**
 * Display Trending News in Sidebar
 */
function displayTrendingNews() {
    const container = document.querySelector('.trending-news-list');
    if (!container) return;
    
    const trendingNews = newsData.filter(news => news.trending).slice(0, 5);
    
    if (trendingNews.length === 0) {
        // Use recent news as fallback
        const recentNews = newsData.slice(0, 5);
        container.innerHTML = recentNews.map((news, index) => createTrendingItem(news, index + 1)).join('');
        return;
    }
    
    container.innerHTML = trendingNews.map((news, index) => createTrendingItem(news, index + 1)).join('');
}

/**
 * Display Popular News in Sidebar
 */
function displayPopularNews() {
    const container = document.querySelector('.popular-news-list');
    if (!container) return;
    
    const popularNews = newsData.filter(news => news.popular).slice(0, 4);
    
    if (popularNews.length === 0) {
        // Use recent news as fallback
        const recentNews = newsData.slice(5, 9);
        container.innerHTML = recentNews.map(news => createPopularItem(news)).join('');
        return;
    }
    
    container.innerHTML = popularNews.map(news => createPopularItem(news)).join('');
}

/**
 * Display Video News
 */
function displayVideoNews() {
    const container = document.querySelector('.video-grid');
    if (!container) return;
    
    const videoNews = newsData.filter(news => news.isVideo).slice(0, 6);
    
    if (videoNews.length === 0) {
        container.innerHTML = '<p class="loading-spinner">Loading...</p>';
        return;
    }
    
    container.innerHTML = videoNews.map(news => createVideoCard(news)).join('');
}

/**
 * Display Category News (for category pages)
 */
function displayCategoryNews() {
    const container = document.querySelector('.category-news-grid');
    if (!container) return;
    
    // Get category from data attribute
    const category = container.dataset.category || 'all';
    
    if (category === 'all') {
        filteredNews = [...newsData];
    } else {
        filteredNews = newsData.filter(news => news.category === category);
    }
    
    if (filteredNews.length === 0) {
        container.innerHTML = '<p class="loading-spinner">Akwai labarin wannan category ba</p>';
        return;
    }
    
    container.innerHTML = filteredNews.map(news => createNewsCard(news)).join('');
}

/**
 * Create News Card HTML
 */
function createNewsCard(news) {
    const imageUrl = news.image || 'assets/images/news/placeholder.jpg';
    const date = formatDate(news.date);
    
    return `
        <article class="news-card">
            <div class="news-card-image">
                <a href="article.html?id=${news.id}">
                    <img src="${imageUrl}" alt="${news.title}" loading="lazy">
                </a>
                <span class="news-card-category">${news.category}</span>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">
                    <a href="article.html?id=${news.id}">${news.title}</a>
                </h3>
                <div class="news-card-meta">
                    <span><i class="far fa-clock"></i> ${date}</span>
                    <span><i class="far fa-eye"></i> ${news.views || 0}</span>
                </div>
                <p class="news-card-excerpt">${news.description}</p>
                <a href="article.html?id=${news.id}" class="news-card-readmore">
                    Karatu <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

/**
 * Create News List Item HTML
 */
function createNewsListItem(news) {
    const imageUrl = news.image || 'assets/images/news/placeholder.jpg';
    const date = formatDate(news.date);
    
    return `
        <article class="news-list-item">
            <div class="news-list-item-image">
                <a href="article.html?id=${news.id}">
                    <img src="${imageUrl}" alt="${news.title}" loading="lazy">
                </a>
            </div>
            <div class="news-list-item-content">
                <span class="news-card-category">${news.category}</span>
                <h3 class="news-card-title">
                    <a href="article.html?id=${news.id}">${news.title}</a>
                </h3>
                <div class="news-card-meta">
                    <span><i class="far fa-clock"></i> ${date}</span>
                    <span><i class="far fa-eye"></i> ${news.views || 0}</span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Create Trending Item HTML
 */
function createTrendingItem(news, index) {
    const imageUrl = news.image || 'assets/images/news/placeholder.jpg';
    const date = formatDate(news.date);
    
    return `
        <div class="trending-item">
            <span class="trending-number">${index}</span>
            <div class="trending-content">
                <h3 class="news-card-title">
                    <a href="article.html?id=${news.id}">${news.title}</a>
                </h3>
                <div class="news-card-meta">
                    <span><i class="far fa-clock"></i> ${date}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create Popular Item HTML
 */
function createPopularItem(news) {
    const imageUrl = news.image || 'assets/images/news/placeholder.jpg';
    const date = formatDate(news.date);
    
    return `
        <div class="popular-item">
            <div class="popular-item-image">
                <a href="article.html?id=${news.id}">
                    <img src="${imageUrl}" alt="${news.title}" loading="lazy">
                </a>
            </div>
            <div class="popular-item-content">
                <h3 class="news-card-title">
                    <a href="article.html?id=${news.id}">${news.title}</a>
                </h3>
                <div class="news-card-meta">
                    <span><i class="far fa-clock"></i> ${date}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create Video Card HTML
 */
function createVideoCard(news) {
    const imageUrl = news.image || 'assets/images/news/placeholder.jpg';
    const date = formatDate(news.date);
    
    return `
        <article class="video-card">
            <div class="video-card-image">
                <a href="article.html?id=${news.id}">
                    <img src="${imageUrl}" alt="${news.title}" loading="lazy">
                </a>
                <div class="video-play-btn">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-card-content">
                <h3 class="video-card-title">
                    <a href="article.html?id=${news.id}">${news.title}</a>
                </h3>
                <div class="video-card-meta">
                    <span><i class="far fa-clock"></i> ${date}</span>
                    <span><i class="far fa-eye"></i> ${news.views || 0}</span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Format Date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ha-NG', options);
}

/**
 * Filter news by category
 */
function filterByCategory(category) {
    if (category === 'all') {
        filteredNews = [...newsData];
    } else {
        filteredNews = newsData.filter(news => news.category === category);
    }
    displayCategoryNews();
}

/**
 * Search news
 */
function searchNews(query) {
    const searchTerm = query.toLowerCase();
    filteredNews = newsData.filter(news => 
        news.title.toLowerCase().includes(searchTerm) ||
        news.description.toLowerCase().includes(searchTerm) ||
        news.category.toLowerCase().includes(searchTerm)
    );
    displayCategoryNews();
}

/**
 * Display sample news (fallback)
 */
function displaySampleNews() {
    const topStories = document.querySelector('.news-grid');
    const latestNews = document.querySelector('.news-list');
    const videoNews = document.querySelector('.video-grid');
    
    const sampleData = getSampleNewsData();
    
    if (topStories) {
        topStories.innerHTML = sampleData.slice(0, 4).map(news => createNewsCard(news)).join('');
    }
    
    if (latestNews) {
        latestNews.innerHTML = sampleData.slice(0, 5).map(news => createNewsListItem(news)).join('');
    }
    
    if (videoNews) {
        videoNews.innerHTML = sampleData.filter(n => n.isVideo).slice(0, 6).map(news => createVideoCard(news)).join('');
    }
}

/**
 * Get sample news data
 */
function getSampleNewsData() {
    return [
        {
            id: 1,
            title: 'Shugaba Buhari Ya Kawo Shawara Kan Yaki Da Fararen Hula',
            category: 'Najeriya',
            image: 'assets/images/news/news1.jpg',
            date: '2026-03-15',
            description: 'Shugaba Muhammadu Buhari ya ce za a biya duk wata hanya don tabbatar da zaman lafiya a kasar.',
            views: 1250,
            featured: true,
            trending: true,
            popular: true,
            isVideo: false
        },
        {
            id: 2,
            title: 'Yayyida Ƙungiyar Ƙwallon Ƙafa ta Najeriya Ta Ci Gasar Ƙwallon Ƙafa',
            category: 'Wasanni',
            image: 'assets/images/news/news2.jpg',
            date: '2026-03-14',
            description: 'Ƙungiyar Ƙwallon Ƙafa ta Najeriya ta lashe gasar cin kofin Afirka ta yamma.',
            views: 980,
            featured: true,
            trending: false,
            popular: true,
            isVideo: true
        },
        {
            id: 3,
            title: 'Shugaban Ƙasar Amurka Ya Bayyana Shawara Kan Yaki Da Shinge',
            category: 'Duniya',
            image: 'assets/images/news/news3.jpg',
            date: '2026-03-13',
            description: 'Shugaba Joe Biden ya bayyana shirin sa ne a taron manema labarai da aka gudanar.',
            views: 756,
            featured: true,
            trending: true,
            popular: false,
            isVideo: false
        },
        {
            id: 4,
            title: 'Sabon Shiri Na Rage Talauci A Ƙasar Najeriya',
            category: 'Najeriya',
            image: 'assets/images/news/news4.jpg',
            date: '2026-03-12',
            description: 'Gwamnati ta sanar da sabon shiri na rage talauci a fadin ƙasar.',
            views: 543,
            featured: true,
            trending: false,
            popular: true,
            isVideo: false
        },
        {
            id: 5,
            title: 'Masu zafin jini a Ukraine sun ci gaba da yaki',
            category: 'Duniya',
            image: 'assets/images/news/news5.jpg',
            date: '2026-03-11',
            description: 'Rikicin Ukraine ya ci gaba da yawaitawa yayin da kungiyoyin kasa da kasa ke kokarin sanya zaman lafiya.',
            views: 432,
            featured: false,
            trending: true,
            popular: false,
            isVideo: true
        },
        {
            id: 6,
            title: 'Wasannin Biki: Matasan Ƙasar Masu Basira',
            category: 'Wasanni',
            image: 'assets/images/news/news6.jpg',
            date: '2026-03-10',
            description: 'Matasan ƙasar sun nuna basira mai ban mamaki a gasar wasannin biki.',
            views: 321,
            featured: false,
            trending: false,
            popular: true,
            isVideo: false
        },
        {
            id: 7,
            title: 'Sabon Shiri Na Ilimi A Ƙasar Najeriya',
            category: 'Najeriya',
            image: 'assets/images/news/news7.jpg',
            date: '2026-03-09',
            description: 'Gwamnati ta bayyana sabon shiri na inganta ilimi a fadin ƙasar.',
            views: 287,
            featured: false,
            trending: true,
            popular: false,
            isVideo: false
        },
        {
            id: 8,
            title: 'Zaman Lafiya A Ƙasar: Sabon Rahoto',
            category: 'Duniya',
            image: 'assets/images/news/news8.jpg',
            date: '2026-03-08',
            description: 'Ƙungiyar kasa da kasa ta fitar da sabon rahoto kan zaman lafiya a duniya.',
            views: 198,
            featured: false,
            trending: false,
            popular: false,
            isVideo: true
        }
    ];
}

// Export functions for use in other modules
window.newsLoader = {
    filterByCategory,
    searchNews,
    getNewsData: () => newsData
};

