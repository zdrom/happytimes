import OpenAI from 'openai';
import { articleCache } from './articleCache.js';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeArticleWithAI = async (article) => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  // Check cache first
  const cachedResult = articleCache.get(article);
  if (cachedResult) {
    // Use cached result
    article.aiSentiment = {
      score: cachedResult.sentiment,
      isUplifting: cachedResult.isUplifting,
      reasoning: cachedResult.reasoning,
      originalScore: cachedResult.sentiment,
      cached: true // Mark as cached for debugging
    };
    return cachedResult;
  }

  const prompt = `Analyze the sentiment and content of this news article. Respond with a JSON object containing:
- sentiment: number from 1-10 (1=very negative, 5=neutral, 10=very positive)
- isUplifting: boolean (true if the article is uplifting/positive/happy news)
- reasoning: brief explanation of the sentiment

Article:
Title: ${article.headline}
Abstract: ${article.abstract}

Respond only with valid JSON:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze news articles and determine if they are uplifting, positive news that would make people happy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.1
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Cache the result
    articleCache.set(article, result);
    
    // Add the AI analysis to the article
    article.aiSentiment = {
      score: result.sentiment,
      isUplifting: result.isUplifting,
      reasoning: result.reasoning,
      originalScore: result.sentiment,
      cached: false // Mark as fresh analysis
    };

    return result;
  } catch (error) {
    console.error('OpenAI sentiment analysis error:', error);
    throw error;
  }
};

export const isHappyArticleAI = async (article) => {
  try {
    const analysis = await analyzeArticleWithAI(article);
    
    // Filter criteria:
    // 1. Must be uplifting according to AI
    // 2. Sentiment score >= 6 (above neutral, leaning positive)
    // 3. No negative keywords (keep the basic keyword filter as backup)
    // 4. No Spanish content
    // 5. No Trump mentions
    
    const negativeKeywords = [
      'death', 'killed', 'murder', 'war', 'attack', 'violence', 
      'crime', 'fraud', 'scandal', 'crisis', 'disaster', 'tragedy',
      'fire', 'accident', 'crash', 'storm', 'flood', 'earthquake',
      'trump'
    ];
    
    const spanishSections = ['en español', 'en espanol', 'spanish', 'espanol'];
    const text = `${article.headline} ${article.abstract}`.toLowerCase();
    
    const hasNegativeKeywords = negativeKeywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    const isSpanishSection = spanishSections.some(section => 
      article.section && article.section.toLowerCase().includes(section.toLowerCase())
    );
    
    const hasSpanishIndicators = text.includes('en español') || text.includes('en espanol');
    
    return analysis.isUplifting && 
           analysis.sentiment >= 6 && 
           !hasNegativeKeywords && 
           !isSpanishSection && 
           !hasSpanishIndicators;
           
  } catch (error) {
    console.error('Error analyzing article with AI:', error);
    // Fallback to false if AI analysis fails
    return false;
  }
};

export const filterHappyArticlesWithAI = async (articles, progressCallback = null) => {
  const filteredArticles = [];
  let processedCount = 0;
  
  // Process articles in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (article) => {
      const isHappy = await isHappyArticleAI(article);
      processedCount++;
      if (progressCallback) {
        progressCallback(processedCount, articles.length);
      }
      return isHappy ? article : null;
    });
    
    const batchResults = await Promise.all(batchPromises);
    const validArticles = batchResults.filter(article => article !== null);
    filteredArticles.push(...validArticles);
    
    // Small delay between batches to be respectful to OpenAI API
    if (i + batchSize < articles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return filteredArticles;
};