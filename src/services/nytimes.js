const NYT_API_BASE_URL = 'https://api.nytimes.com/svc/news/v3/content';

export const fetchArticles = async (apiKey) => {
  if (!apiKey) {
    throw new Error('NYTimes API key is required');
  }

  try {
    const response = await fetch(
      `${NYT_API_BASE_URL}/all/all.json?api-key=${apiKey}&limit=100`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const formatArticle = (article) => {
  // Find the best quality image from multimedia array
  let thumbnail = null;
  if (article.multimedia && article.multimedia.length > 0) {
    // Look for larger images first (they usually have better quality)
    const largeImage = article.multimedia.find(media => 
      media.subtype === 'xlarge' || media.subtype === 'superJumbo' || media.subtype === 'jumbo'
    );
    const mediumImage = article.multimedia.find(media => 
      media.subtype === 'mediumThreeByTwo440' || media.subtype === 'mediumThreeByTwo210'
    );
    
    thumbnail = largeImage?.url || mediumImage?.url || article.multimedia[0]?.url;
  }

  return {
    id: article.uri,
    headline: article.title,
    abstract: article.abstract,
    url: article.url,
    publishedDate: article.published_date,
    byline: article.byline,
    section: article.section,
    thumbnail,
    language: article.language || 'en'
  };
};

export const isEnglishArticle = (article) => {
  return !article.language || article.language === 'en' || article.language === 'eng';
};