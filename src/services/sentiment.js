import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const analyzeSentiment = (text) => {
  if (!text) return { score: 0, positive: false };
  
  const result = sentiment.analyze(text);
  return {
    score: result.score,
    positive: result.score > 0,
    comparative: result.comparative,
    words: result.words,
    positiveWords: result.positive,
    negativeWords: result.negative
  };
};

export const isHappyArticle = (article) => {
  const headlineAnalysis = analyzeSentiment(article.headline);
  const abstractAnalysis = analyzeSentiment(article.abstract);
  
  const combinedScore = headlineAnalysis.score + abstractAnalysis.score;
  const isPositive = combinedScore > 0;
  
  const negativeKeywords = [
    'death', 'killed', 'murder', 'war', 'attack', 'violence', 
    'crime', 'fraud', 'scandal', 'crisis', 'disaster', 'tragedy',
    'fire', 'accident', 'crash', 'storm', 'flood', 'earthquake',
    'trump'
  ];
  
  const text = `${article.headline} ${article.abstract}`.toLowerCase();
  const hasNegativeKeywords = negativeKeywords.some(keyword => 
    text.includes(keyword)
  );
  
  // Add sentiment data to article for display
  article.sentimentData = {
    headlineScore: headlineAnalysis.score,
    abstractScore: abstractAnalysis.score,
    combinedScore,
    hasNegativeKeywords
  };
  
  return isPositive && !hasNegativeKeywords;
};

export const filterHappyArticles = (articles) => {
  return articles.filter(article => {
    // Filter out Spanish sections
    const spanishSections = ['en español', 'en espanol', 'spanish', 'espanol'];
    const isSpanishSection = spanishSections.some(section => 
      article.section && article.section.toLowerCase().includes(section.toLowerCase())
    );
    
    // Filter by language if available
    const isEnglish = !article.language || article.language === 'en' || article.language === 'eng';
    
    // Check if headline or abstract contains Spanish indicators
    const text = `${article.headline} ${article.abstract}`.toLowerCase();
    const hasSpanishIndicators = text.includes('en español') || text.includes('en espanol');
    
    return !isSpanishSection && isEnglish && !hasSpanishIndicators && isHappyArticle(article);
  });
};