/**
 * 第一阶段：Markdown文件浏览与渲染
 * 主要功能：文件上传、列表显示、文章阅读、视图切换
 */

// 全局状态管理
const AppState = {
    articles: [], // 存储所有文章数据
    currentPage: 1, // 当前页码
    articlesPerPage: 10, // 每页显示文章数
    currentFilter: '', // 当前筛选条件
    searchKeyword: '', // 搜索关键词
    currentArticle: null, // 当前查看的文章
    isSourceView: false // 是否显示源码视图
};

// 本地存储键名
const STORAGE_KEY = 'blog_articles';

/**
 * 初始化应用
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 加载本地存储的文章
    loadArticlesFromStorage();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化视图
    updateArticlesList();
    updateRecentArticles();
    
    console.log('博客应用初始化完成');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.dataset.view;
            if (view) {
                showView(view);
                updateNavigation(this);
            }
        });
    });
    
    // 文件上传相关事件
    const fileInput = document.getElementById('file-input');
    const fileUpload = document.getElementById('file-upload');
    const uploadTrigger = document.querySelector('.upload-trigger');
    
    if (fileInput && fileUpload && uploadTrigger) {
        // 点击上传按钮
        uploadTrigger.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('click', () => fileInput.click());
        
        // 文件选择
        fileInput.addEventListener('change', handleFileSelect);
        
        // 拖拽上传
        fileUpload.addEventListener('dragover', handleDragOver);
        fileUpload.addEventListener('dragleave', handleDragLeave);
        fileUpload.addEventListener('drop', handleFileDrop);
    }
    
    // 搜索和筛选
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
    
    // 分页
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));
    
    // 文章阅读器视图切换
    const renderedToggle = document.getElementById('rendered-toggle');
    const sourceToggle = document.getElementById('source-toggle');
    
    if (renderedToggle) {
        renderedToggle.addEventListener('click', () => toggleArticleView(false));
    }
    if (sourceToggle) {
        sourceToggle.addEventListener('click', () => toggleArticleView(true));
    }
}

/**
 * 视图切换
 */
function showView(viewName) {
    // 隐藏所有视图
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // 显示目标视图
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // 特殊处理
    if (viewName === 'articles') {
        updateArticlesList();
    }
}

/**
 * 更新导航状态
 */
function updateNavigation(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

/**
 * 文件处理相关函数
 */
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

/**
 * 处理上传的文件
 */
async function processFiles(files) {
    const markdownFiles = files.filter(file => 
        file.name.endsWith('.md') || file.name.endsWith('.markdown')
    );
    
    if (markdownFiles.length === 0) {
        alert('请选择Markdown文件（.md 或 .markdown）');
        return;
    }
    
    showUploadProgress(true);
    
    try {
        for (let i = 0; i < markdownFiles.length; i++) {
            const file = markdownFiles[i];
            const progress = ((i + 1) / markdownFiles.length) * 100;
            updateUploadProgress(progress, `处理文件 ${i + 1}/${markdownFiles.length}: ${file.name}`);
            
            await processMarkdownFile(file);
        }
        
        // 处理完成
        showUploadProgress(false);
        saveArticlesToStorage();
        updateArticlesList();
        updateRecentArticles();
        
        alert(`成功上传 ${markdownFiles.length} 个文件！`);
        showView('articles');
        
    } catch (error) {
        console.error('文件处理错误:', error);
        alert('文件处理失败，请重试');
        showUploadProgress(false);
    }
}

/**
 * 处理单个Markdown文件
 */
function processMarkdownFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            const article = {
                id: generateId(),
                title: extractTitle(content, file.name),
                content: content,
                filename: file.name,
                size: formatFileSize(file.size),
                uploadTime: new Date().toISOString(),
                lastModified: new Date(file.lastModified).toISOString()
            };
            
            // 检查是否已存在相同文件名的文章
            const existingIndex = AppState.articles.findIndex(a => a.filename === file.name);
            if (existingIndex !== -1) {
                // 更新现有文章
                AppState.articles[existingIndex] = article;
            } else {
                // 添加新文章
                AppState.articles.push(article);
            }
            
            resolve();
        };
        
        reader.onerror = function() {
            reject(new Error(`读取文件失败: ${file.name}`));
        };
        
        reader.readAsText(file, 'UTF-8');
    });
}

/**
 * 从Markdown内容中提取标题
 */
function extractTitle(content, filename) {
    // 尝试从内容中提取第一个标题
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
        return titleMatch[1].trim();
    }
    
    // 如果没有找到标题，使用文件名（去掉扩展名）
    return filename.replace(/\.(md|markdown)$/i, '');
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 显示/隐藏上传进度
 */
function showUploadProgress(show) {
    const uploadArea = document.querySelector('.file-upload');
    const progressArea = document.getElementById('upload-progress');
    
    if (show) {
        uploadArea.style.display = 'none';
        progressArea.style.display = 'block';
    } else {
        uploadArea.style.display = 'block';
        progressArea.style.display = 'none';
    }
}

/**
 * 更新上传进度
 */
function updateUploadProgress(percent, text) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = text;
}

/**
 * 搜索和筛选
 */
function handleSearch(e) {
    AppState.searchKeyword = e.target.value.toLowerCase();
    AppState.currentPage = 1;
    updateArticlesList();
}

function handleFilter(e) {
    AppState.currentFilter = e.target.value;
    AppState.currentPage = 1;
    updateArticlesList();
}

/**
 * 获取筛选后的文章列表
 */
function getFilteredArticles() {
    let filtered = [...AppState.articles];
    
    // 搜索筛选
    if (AppState.searchKeyword) {
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(AppState.searchKeyword) ||
            article.content.toLowerCase().includes(AppState.searchKeyword)
        );
    }
    
    // 排序筛选
    switch (AppState.currentFilter) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.uploadTime) - new Date(b.uploadTime));
            break;
        default:
            // 默认按上传时间倒序
            filtered.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
    }
    
    return filtered;
}

/**
 * 更新文章列表
 */
function updateArticlesList() {
    const filtered = getFilteredArticles();
    const container = document.getElementById('articles-list');
    const pagination = document.getElementById('pagination');
    
    if (!container) return;
    
    // 计算分页
    const totalPages = Math.ceil(filtered.length / AppState.articlesPerPage);
    const startIndex = (AppState.currentPage - 1) * AppState.articlesPerPage;
    const endIndex = startIndex + AppState.articlesPerPage;
    const pageArticles = filtered.slice(startIndex, endIndex);
    
    // 渲染文章列表
    if (pageArticles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>没有找到文章。${AppState.articles.length === 0 ? '<a href="#" onclick="showView(\'upload\')">上传一些Markdown文件</a>开始吧！' : '尝试调整搜索条件。'}</p>
            </div>
        `;
    } else {
        container.innerHTML = pageArticles.map(article => `
            <div class="article-item" onclick="openArticle('${article.id}')">
                <h3>${escapeHtml(article.title)}</h3>
                <p>${escapeHtml(getArticlePreview(article.content))}</p>
                <div class="article-meta">
                    <span>📅 ${formatDate(article.uploadTime)}</span>
                    <span>📄 ${article.size}</span>
                    <span>📝 ${article.filename}</span>
                </div>
            </div>
        `).join('');
    }
    
    // 更新分页
    updatePagination(totalPages);
}

/**
 * 更新最新文章
 */
function updateRecentArticles() {
    const container = document.getElementById('recent-articles-list');
    if (!container) return;
    
    const recentArticles = AppState.articles
        .sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))
        .slice(0, 6);
    
    if (recentArticles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>还没有文章，<a href="#" onclick="showView('upload')">开始写作</a>吧！</p>
            </div>
        `;
    } else {
        container.innerHTML = recentArticles.map(article => `
            <div class="article-item" onclick="openArticle('${article.id}')">
                <h3>${escapeHtml(article.title)}</h3>
                <p>${escapeHtml(getArticlePreview(article.content))}</p>
                <div class="article-meta">
                    <span>📅 ${formatDate(article.uploadTime)}</span>
                    <span>📄 ${article.size}</span>
                </div>
            </div>
        `).join('');
    }
}

/**
 * 获取文章预览文本
 */
function getArticlePreview(content, maxLength = 150) {
    // 移除Markdown标记
    const plainText = content
        .replace(/#{1,6}\s+/g, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/`(.*?)`/g, '$1') // 移除代码标记
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
        .replace(/\n+/g, ' ') // 将换行符替换为空格
        .trim();
    
    return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}

/**
 * 分页相关函数
 */
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    if (pageInfo) {
        pageInfo.textContent = `第 ${AppState.currentPage} 页，共 ${totalPages} 页`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = AppState.currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = AppState.currentPage >= totalPages;
    }
}

function changePage(direction) {
    const filtered = getFilteredArticles();
    const totalPages = Math.ceil(filtered.length / AppState.articlesPerPage);
    
    AppState.currentPage += direction;
    
    if (AppState.currentPage < 1) AppState.currentPage = 1;
    if (AppState.currentPage > totalPages) AppState.currentPage = totalPages;
    
    updateArticlesList();
    
    // 滚动到顶部
    document.querySelector('.articles-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * 打开文章阅读
 */
function openArticle(articleId) {
    const article = AppState.articles.find(a => a.id === articleId);
    if (!article) return;
    
    AppState.currentArticle = article;
    AppState.isSourceView = false;
    
    // 更新文章内容
    updateArticleReader();
    
    // 切换到阅读视图
    showView('reader');
}

/**
 * 更新文章阅读器
 */
function updateArticleReader() {
    const article = AppState.currentArticle;
    if (!article) return;
    
    // 更新文章信息
    const titleEl = document.getElementById('article-title');
    const dateEl = document.getElementById('article-date');
    const sizeEl = document.getElementById('article-size');
    
    if (titleEl) titleEl.textContent = article.title;
    if (dateEl) dateEl.textContent = `发布于 ${formatDate(article.uploadTime)}`;
    if (sizeEl) sizeEl.textContent = article.size;
    
    // 更新内容显示
    updateArticleContent();
}

/**
 * 更新文章内容显示
 */
function updateArticleContent() {
    const article = AppState.currentArticle;
    if (!article) return;
    
    const renderedContent = document.getElementById('rendered-content');
    const sourceContent = document.getElementById('source-content');
    const renderedToggle = document.getElementById('rendered-toggle');
    const sourceToggle = document.getElementById('source-toggle');
    
    if (AppState.isSourceView) {
        // 显示源码
        if (renderedContent) renderedContent.style.display = 'none';
        if (sourceContent) {
            sourceContent.style.display = 'block';
            sourceContent.textContent = article.content;
        }
        if (renderedToggle) renderedToggle.classList.remove('active');
        if (sourceToggle) sourceToggle.classList.add('active');
    } else {
        // 显示渲染后的内容
        if (sourceContent) sourceContent.style.display = 'none';
        if (renderedContent) {
            renderedContent.style.display = 'block';
            // 使用marked.js渲染Markdown
            try {
                renderedContent.innerHTML = marked.parse(article.content);
            } catch (error) {
                console.error('Markdown渲染错误:', error);
                renderedContent.innerHTML = '<p>渲染失败，请尝试查看源码。</p>';
            }
        }
        if (sourceToggle) sourceToggle.classList.remove('active');
        if (renderedToggle) renderedToggle.classList.add('active');
    }
}

/**
 * 切换文章视图（渲染/源码）
 */
function toggleArticleView(isSource) {
    AppState.isSourceView = isSource;
    updateArticleContent();
}

/**
 * 本地存储相关函数
 */
function saveArticlesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.articles));
    } catch (error) {
        console.error('保存文章到本地存储失败:', error);
    }
}

function loadArticlesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            AppState.articles = JSON.parse(stored);
        }
    } catch (error) {
        console.error('从本地存储加载文章失败:', error);
        AppState.articles = [];
    }
}

/**
 * 工具函数
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 全局函数导出（供HTML中的onclick使用）
window.showView = showView;
window.openArticle = openArticle;