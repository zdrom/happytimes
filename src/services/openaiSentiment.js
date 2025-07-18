import OpenAI from 'openai';
import { articleCache } from './articleCache.js';

let openai = null;

const initOpenAI = (apiKey) => {
  if (!openai || openai.apiKey !== apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }
};

export const analyzeArticleWithAI = async (article, apiKey) => {
  if (!apiKey) {
    throw new Error('OpenAI API key not provided');
  }

  initOpenAI(apiKey);

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

    // Log the complete OpenAI response to console
    console.log('OpenAI API Response:', response);
    console.log('OpenAI Message Content:', response.choices[0].message.content);

    const result = JSON.parse(response.choices[0].message.content);
    
    // Log the parsed result
    console.log('Parsed AI Analysis Result:', result);
    
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

export const isHappyArticleAI = async (article, apiKey) => {
  try {
    const analysis = await analyzeArticleWithAI(article, apiKey);
    
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

export const filterHappyArticlesWithAI = async (articles, apiKey, progressCallback = null) => {
  const filteredArticles = [];
  let processedCount = 0;
  
  // Separate cached and uncached articles for optimized processing
  const cachedArticles = [];
  const uncachedArticles = [];
  
  articles.forEach(article => {
    if (articleCache.has(article)) {
      cachedArticles.push(article);
    } else {
      uncachedArticles.push(article);
    }
  });
  
  // Process cached articles instantly (no AI calls needed)
  for (const article of cachedArticles) {
    const cachedResult = articleCache.get(article);
    if (cachedResult) {
      // Apply cached analysis to article
      article.aiSentiment = {
        score: cachedResult.sentiment,
        isUplifting: cachedResult.isUplifting,
        reasoning: cachedResult.reasoning,
        originalScore: cachedResult.sentiment,
        cached: true
      };
      
      // Apply the same filtering logic as isHappyArticleAI but without async
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
      
      const isHappy = cachedResult.isUplifting && 
                     cachedResult.sentiment >= 6 && 
                     !hasNegativeKeywords && 
                     !isSpanishSection && 
                     !hasSpanishIndicators;
      
      if (isHappy) {
        filteredArticles.push(article);
      }
    }
    
    processedCount++;
    if (progressCallback) {
      progressCallback(processedCount, articles.length, [...filteredArticles]);
    }
  }
  
  // If we have cached articles, send them immediately for progressive loading
  if (filteredArticles.length > 0 && progressCallback) {
    progressCallback(processedCount, articles.length, [...filteredArticles]);
  }
  
  // Process uncached articles in batches with delays
  const batchSize = 5;
  for (let i = 0; i < uncachedArticles.length; i += batchSize) {
    const batch = uncachedArticles.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (article) => {
      const isHappy = await isHappyArticleAI(article, apiKey);
      processedCount++;
      
      let updatedArticles = [...filteredArticles];
      if (isHappy) {
        filteredArticles.push(article);
        updatedArticles = [...filteredArticles];
      }
      
      if (progressCallback) {
        progressCallback(processedCount, articles.length, updatedArticles);
      }
      return isHappy ? article : null;
    });
    
    await Promise.all(batchPromises);
    
    // Only add delay between batches if there are more uncached articles to process
    if (i + batchSize < uncachedArticles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return filteredArticles;
};