// Article cache to avoid re-analyzing same articles with AI
class ArticleCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 500; // Store up to 500 analyzed articles
    this.cacheKey = 'happytimes_article_cache';
    this.loadFromStorage();
  }

  // Generate a unique key for an article based on its content
  generateKey(article) {
    return `${article.headline}_${article.abstract}_${article.publishedDate}`.replace(/\s+/g, '');
  }

  // Check if article has been analyzed before
  has(article) {
    const key = this.generateKey(article);
    return this.cache.has(key);
  }

  // Get cached analysis for an article
  get(article) {
    const key = this.generateKey(article);
    const cached = this.cache.get(key);
    
    if (cached) {
      // Update timestamp to keep frequently accessed items
      cached.lastAccessed = Date.now();
      return cached.analysis;
    }
    
    return null;
  }

  // Store analysis result for an article
  set(article, analysis) {
    const key = this.generateKey(article);
    
    // If cache is full, remove oldest items
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }
    
    this.cache.set(key, {
      analysis,
      timestamp: Date.now(),
      lastAccessed: Date.now()
    });
    
    this.saveToStorage();
  }

  // Remove old entries to make room
  cleanup() {
    const entries = Array.from(this.cache.entries());
    
    // Sort by last accessed time (oldest first)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove oldest 25% of entries
    const toRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // Load cache from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Only load recent entries (within last 24 hours)
        const cutoff = Date.now() - (24 * 60 * 60 * 1000);
        
        Object.entries(data).forEach(([key, value]) => {
          if (value.timestamp > cutoff) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load article cache:', error);
    }
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save article cache:', error);
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hitCount / Math.max(this.totalRequests, 1)
    };
  }

  // Clear the entire cache
  clear() {
    this.cache.clear();
    localStorage.removeItem(this.cacheKey);
  }
}

// Export singleton instance
export const articleCache = new ArticleCache();