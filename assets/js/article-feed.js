(function () {
    const dataPath = 'assets/data/articles.json';
    let articles = [];
    let loadPromise = null;

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatViews(value) {
        if (value >= 1000) {
            return `${Math.round(value / 1000)}K views`;
        }
        return `${value} views`;
    }

    function createCard(article) {
        return `
            <article class="news-card">
                <a href="article.html?id=${article.id}" class="news-card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <span class="news-card-category">${article.category}</span>
                    ${article.isVideo ? '<span class="news-card-badge">Bidiyo</span>' : ''}
                </a>
                <div class="news-card-body">
                    <div class="news-card-meta">
                        <span><i class="far fa-clock"></i> ${article.timeToRead}</span>
                        <span><i class="far fa-eye"></i> ${formatViews(article.views)}</span>
                    </div>
                    <h3 class="news-card-title"><a href="article.html?id=${article.id}">${article.title}</a></h3>
                    <p>${article.summary}</p>
                    <div class="news-card-author">
                        <span>by ${article.author}</span>
                        <span>${formatDate(article.date)}</span>
                    </div>
                </div>
            </article>
        `;
    }

    function renderList(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(createCard).join('');
    }

    function renderGridList(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(item => `
            <article class="list-card">
                <a href="article.html?id=${item.id}">${item.title}</a>
                <span>${formatDate(item.date)}</span>
            </article>
        `).join('');
    }

    function renderFeaturedArticle(featured) {
        const container = document.getElementById('featured-article');
        if (!container || !featured) return;
        container.innerHTML = `
            <a class="featured-image" href="article.html?id=${featured.id}">
                <img src="${featured.image}" alt="${featured.title}" loading="lazy">
            </a>
            <div class="featured-body">
                <div class="featured-meta">
                    <span>${featured.category}</span>
                    <span>${formatDate(featured.date)}</span>
                </div>
                <h2><a href="article.html?id=${featured.id}">${featured.title}</a></h2>
                <p>${featured.summary}</p>
                <div class="featured-actions">
                    <span>by ${featured.author}</span>
                    <span>${featured.timeToRead}</span>
                </div>
            </div>
        `;
    }

    function renderBreakingNews() {
        const breaking = articles.filter(article => article.isBreaking).slice(0, 4);
        renderGridList('breaking-news-list', breaking);
    }

    function renderTrendingStories() {
        const trending = articles.filter(article => article.isTrending).slice(0, 4);
        renderList('trending-stories', trending);
    }

    function renderMostRead() {
        const mostRead = articles.filter(article => article.isMostRead).slice(0, 4);
        renderList('most-read', mostRead);
    }

    function renderEditorPicks() {
        const picks = articles.filter(article => article.isEditorPick).slice(0, 4);
        renderList('editor-picks', picks);
    }

    function renderVideoNews() {
        const videos = articles.filter(article => article.isVideo).slice(0, 4);
        renderList('video-news', videos);
    }

    function renderCategories() {
        const container = document.getElementById('category-pill-list');
        if (!container) return;
        const categories = Array.from(new Set(articles.map(article => article.category)));
        container.innerHTML = categories.map(cat => `<a href="category.html?cat=${encodeURIComponent(cat)}" class="category-pill">${cat}</a>`).join('');
    }

    function renderSidebarList(containerId, filterFn) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const list = articles.filter(filterFn).slice(0, 5);
        container.innerHTML = list.map(article => `
            <a href="article.html?id=${article.id}" class="sidebar-link">
                <span>${article.title}</span>
                <small>${formatDate(article.date)}</small>
            </a>
        `).join('');
    }

    function renderSidebarWidgets() {
        renderSidebarList('sidebar-trending', article => article.isTrending);
        renderSidebarList('sidebar-popular', article => article.isMostRead);
        renderSidebarList('sidebar-recent', (_, index) => index < 5);
    }

    function updateSchema(featured) {
        const schemaContainer = document.getElementById('news-schema');
        if (!schemaContainer || !featured) return;
        const schema = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            },
            "headline": featured.title,
            "image": [featured.image],
            "datePublished": featured.date,
            "dateModified": featured.date,
            "author": {
                "@type": "Person",
                "name": featured.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "Bash TV Media",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://bashtvmedia.com/assets/images/logo.png"
                }
            }
        };
        schemaContainer.textContent = JSON.stringify(schema, null, 2);
    }

    function renderLiveCard() {
        const container = document.getElementById('live-tv-card');
        if (!container) return;
        container.innerHTML = `
            <h3>Live TV</h3>
            <p>Kalli Bash TV kai tsaye tare da rahotanni, hira da shirye-shirye na musamman.</p>
            <a class="cta-button" href="live.html">Duba Live TV</a>
        `;
    }

    function renderSearchResults(results, query) {
        const headerResults = document.getElementById('header-search-results');
        const pageResults = document.getElementById('search-results');
        const message = query ? `Showing results for "${query}"` : 'Search results';
        const markup = results.length
            ? results.map(article => `
                <div class="search-result">
                    <a href="article.html?id=${article.id}">${article.title}</a>
                    <span>${formatDate(article.date)}</span>
                </div>
            `).join('')
            : `<p class="search-empty">No articles matched your search.</p>`;
        if (headerResults) {
            headerResults.innerHTML = `<p>${message}</p>${markup}`;
        }
        if (pageResults) {
            pageResults.classList.add('search-results-active');
            pageResults.innerHTML = `<div class="section-heading"><h2>Search</h2><small>${results.length} result(s)</small></div>${markup}`;
        }
    }

    function clearSearchResults() {
        const headerResults = document.getElementById('header-search-results');
        const pageResults = document.getElementById('search-results');
        if (headerResults) {
            headerResults.innerHTML = '';
        }
        if (pageResults) {
            pageResults.classList.remove('search-results-active');
            pageResults.innerHTML = '';
        }
    }

    function searchArticles(query) {
        if (!query) {
            clearSearchResults();
            return [];
        }
        const normalized = query.toLowerCase();
        const results = articles.filter(article => {
            const text = `${article.title} ${article.summary} ${article.keywords.join(' ')} ${article.tags.join(' ')}`.toLowerCase();
            return text.includes(normalized);
        });
        renderSearchResults(results, query);
        return results;
    }

    function initNewsletter() {
        const form = document.getElementById('newsletter-form');
        const message = document.getElementById('newsletter-message');
        if (!form) return;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = form.querySelector('input[type="email"]');
            if (email && email.value) {
                message.textContent = 'Mun gode! Za mu turo maka sabbin labarai.';
                message.classList.add('newsletter-success');
                form.reset();
            }
        });
    }

    function initHome() {
        fetchArticles().then(() => {
            if (articles.length === 0) return;
            renderFeaturedArticle(articles[0]);
            renderList('latest-news', articles.slice(0, 6));
            renderBreakingNews();
            renderTrendingStories();
            renderMostRead();
            renderEditorPicks();
            renderVideoNews();
            renderCategories();
            renderSidebarWidgets();
            renderLiveCard();
            updateSchema(articles[0]);
            initNewsletter();
        });
    }

    function renderCategoryList(categoryName) {
        return fetchArticles().then(() => {
            const container = document.getElementById('category-results');
            if (!container) return;
            const normalized = (categoryName || '').toLowerCase();
            const matches = articles.filter(article => {
                if (!normalized) return true;
                return article.category.toLowerCase() === normalized;
            });
            if (matches.length === 0) {
                container.innerHTML = '<p>Babu labarai a wannan rukuni.</p>';
                return;
            }
            container.innerHTML = matches.map(createCard).join('');
        });
    }

    function fetchArticles() {
        if (loadPromise) {
            return loadPromise;
        }
        loadPromise = fetch(dataPath)
            .then(response => response.json())
            .then(data => {
                articles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                return articles;
            })
            .catch(error => {
                console.error('Unable to load articles', error);
                return [];
            });
        return loadPromise;
    }

    window.BashTV = {
        initHome,
        fetchArticles,
        searchArticles,
        renderSearchResults,
        clearSearchResults,
        renderCategoryList,
        getArticles: () => articles
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.classList.contains('home-page')) {
            initHome();
        }
        if (document.body.classList.contains('category-page')) {
            const params = new URLSearchParams(window.location.search);
            const category = params.get('cat');
            renderCategoryList(category || '');
        }
    });
})();
