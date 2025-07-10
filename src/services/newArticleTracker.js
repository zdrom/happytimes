// Track new articles since last visit
class NewArticleTracker {
  constructor() {
    this.storageKey = 'happytimes_last_visit';
    this.lastVisitTime = this.getLastVisitTime();
    this.updateLastVisitTime();
  }

  // Get the timestamp of the last visit
  getLastVisitTime() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.warn('Failed to get last visit time:', error);
      return 0;
    }
  }

  // Update the last visit timestamp to now
  updateLastVisitTime() {
    try {
      localStorage.setItem(this.storageKey, Date.now().toString());
    } catch (error) {
      console.warn('Failed to update last visit time:', error);
    }
  }

  // Check if an article is new since the last visit
  isNewArticle(article) {
    if (!article.publishedDate) return false;
    
    const publishTime = new Date(article.publishedDate).getTime();
    return publishTime > this.lastVisitTime;
  }

  // Mark articles as new or old and sort them
  processArticles(articles) {
    const articlesWithNewFlag = articles.map(article => ({
      ...article,
      isNew: this.isNewArticle(article)
    }));

    // Sort: new articles first, then by publish date (newest first)
    return articlesWithNewFlag.sort((a, b) => {
      // If one is new and other isn't, new comes first
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      
      // If both have same "new" status, sort by publish date (newest first)
      const aTime = new Date(a.publishedDate).getTime();
      const bTime = new Date(b.publishedDate).getTime();
      return bTime - aTime;
    });
  }

  // Get the index where the divider should be placed
  // Returns -1 if no divider needed (all new or all old)
  getDividerIndex(articles) {
    const firstOldIndex = articles.findIndex(article => !article.isNew);
    return firstOldIndex > 0 ? firstOldIndex : -1;
  }

  // Reset the tracker (for testing or manual reset)
  reset() {
    try {
      localStorage.removeItem(this.storageKey);
      this.lastVisitTime = 0;
    } catch (error) {
      console.warn('Failed to reset new article tracker:', error);
    }
  }
}

// Export singleton instance
export const newArticleTracker = new NewArticleTracker();