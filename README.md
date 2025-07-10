# 🌟 HappyTimes

A personal news aggregator that shows only happy and uplifting articles from The New York Times.

## Features

- **Sentiment Analysis**: Filters articles to show only positive/uplifting content
- **Smart Filtering**: Removes articles with negative keywords, political content, and Spanish articles
- **Mobile-First Design**: Clean, responsive interface built with Tailwind CSS
- **Sentiment Scores**: Visual indicators showing how positive each article is
- **Thumbnail Images**: Article thumbnails displayed at their natural size
- **Real-time Updates**: Refresh button to get the latest happy news

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom happy color palette
- **Sentiment Analysis**: Sentiment.js for client-side analysis
- **API**: NYTimes TimeWire API integration

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/happyTimes.git
   cd happyTimes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get a NYTimes API key from [NYTimes Developer Portal](https://developer.nytimes.com/get-started)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000` and enter your API key

## How It Works

1. **Fetches** articles from the NYTimes TimeWire API
2. **Analyzes** sentiment of headlines and abstracts using Sentiment.js
3. **Filters** to show only articles with positive sentiment scores (>0)
4. **Excludes** articles with negative keywords, Spanish content, and political references
5. **Displays** happy news in a beautiful, mobile-friendly interface

## Filtering Logic

Articles are included if they meet ALL criteria:
- ✅ Positive sentiment score (combined headline + abstract > 0)
- ✅ English language only
- ✅ No negative keywords (death, war, crime, etc.)
- ✅ No political content (Trump references filtered out)
- ✅ No Spanish sections or content

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

Built with ❤️ to spread positivity through news