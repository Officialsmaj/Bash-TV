(function () {
    const articleSchema = document.getElementById('article-schema');
    const articleTitle = document.getElementById('article-title');
    const articleMeta = document.getElementById('article-meta');
    const articleImage = document.getElementById('article-image');
    const articleBody = document.getElementById('article-body');
    const articleTags = document.getElementById('article-tags');
    const relatedContainer = document.getElementById('related-articles');

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatViews(value) {
        if (!value) return '0 views';
        return value >= 1000 ? `${Math.round(value / 1000)}K views` : `${value} views`;
    }

    function createRelatedCard(article) {
        return `
            <article class="news-card">
                <a href="article.html?id=${article.id}" class="news-card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <span class="news-card-category">${article.category}</span>
                </a>
                <div class="news-card-body">
                    <h3 class="news-card-title"><a href="article.html?id=${article.id}">${article.title}</a></h3>
                    <p>${article.summary}</p>
                    <div class="news-card-meta">
                        <span>${formatDate(article.date)}</span>
                        <span>${formatViews(article.views)}</span>
                    </div>
                </div>
            </article>
        `;
    }

    function updateSchema(article) {
        if (!articleSchema || !article) return;
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': window.location.href
            },
            'headline': article.title,
            'image': [article.image],
            'datePublished': article.date,
            'dateModified': article.date,
            'author': {
                '@type': 'Person',
                'name': article.author
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'Bash TV Media',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://bashtvmedia.com/assets/images/logo.png'
                }
            }
        };
        articleSchema.textContent = JSON.stringify(schema, null, 2);
    }

    function initDisqus(article) {
        if (!article) return;
        const disqusShortname = 'bash-tv-media'; // replace with actual shortname
        if (window.DISQUS) {
            window.DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.url = window.location.href;
                    this.page.identifier = article.id;
                    this.page.title = article.title;
                }
            });
            return;
        }

        const d = document;
        const config = function () {
            this.page.url = window.location.href;
            this.page.identifier = article.id;
            this.page.title = article.title;
        };
        window.disqus_config = config;
        const script = d.createElement('script');
        script.src = `https://${disqusShortname}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', String(+new Date()));
        script.async = true;
        d.body.appendChild(script);
    }

    function renderArticle(article) {
        if (!article) {
            articleTitle.textContent = 'Article not found';
            articleBody.innerHTML = '<p>We could not find the requested article.</p>';
            return;
        }
        articleTitle.textContent = article.title;
        articleMeta.innerHTML = `
            <span id="article-category">${article.category}</span>
            <span id="article-date">${formatDate(article.date)}</span>
            <span id="article-views">${formatViews(article.views)}</span>
        `;
        articleImage.innerHTML = `<img src="${article.image}" alt="${article.title}" loading="lazy">`;
        articleBody.innerHTML = article.content.map(paragraph => `<p>${paragraph}</p>`).join('');
        articleTags.innerHTML = article.tags.map(tag => `<a href="category.html?cat=${encodeURIComponent(tag)}">${tag}</a>`).join(', ');
        updateSchema(article);
        initDisqus(article);
    }

    function renderRelated(articleId) {
        const container = relatedContainer;
        if (!container) return;
        const related = (window.BashTV?.getArticles() || []).filter(entry => entry.id !== articleId).slice(0, 4);
        container.innerHTML = related.map(createRelatedCard).join('');
    }

    function initPage() {
        if (!window.BashTV) {
            console.warn('BashTV object is missing.');
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');
        window.BashTV.fetchArticles().then(list => {
            const article = articleId
                ? list.find(entry => entry.id === articleId)
                : list[0];
            renderArticle(article);
            renderRelated(article?.id);
        });
    }

    document.addEventListener('DOMContentLoaded', initPage);
})();
