# 🌟 HappyTimes

A personal news aggregator that shows only happy and uplifting articles from The New York Times.

## Features

- **AI-Powered Sentiment Analysis**: Uses OpenAI to intelligently filter articles for truly uplifting content
- **Smart Filtering**: Removes articles with negative keywords, political content, and Spanish articles
- **Mobile-First Design**: Clean, responsive interface built with Tailwind CSS
- **Sentiment Scores**: Visual indicators showing how positive each article is
- **Thumbnail Images**: Article thumbnails displayed at their natural size
- **Real-time Updates**: Refresh button to get the latest happy news

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom happy color palette
- **AI Analysis**: OpenAI GPT-3.5-turbo for intelligent sentiment analysis
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

3. Get API keys:
   - NYTimes API key from [NYTimes Developer Portal](https://developer.nytimes.com/get-started)
   - OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

5. Add your API keys to the `.env` file:
   ```
   VITE_NYTIMES_API_KEY=your_actual_nytimes_api_key_here
   VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open your browser to `http://localhost:3000` - articles will load automatically!

## Security

The app includes password protection to prevent unauthorized API usage when deployed publicly:

- **Default password**: `happynews2024`
- **To change**: Edit the `CORRECT_PASSWORD` in `src/components/AuthGate.jsx`
- **Authentication**: Stored in localStorage, persists across sessions

## How It Works

1. **Fetches** articles from the NYTimes TimeWire API
2. **Analyzes** sentiment using OpenAI GPT-3.5-turbo for intelligent content evaluation
3. **Filters** to show only articles with AI-verified uplifting content (6+/10 positivity score)
4. **Excludes** articles with negative keywords, Spanish content, and political references
5. **Displays** happy news with AI reasoning in a beautiful, mobile-friendly interface

## Filtering Logic

Articles are included if they meet ALL criteria:
- ✅ AI-verified uplifting content (GPT-3.5-turbo analysis)
- ✅ Sentiment score of 6+/10 (above neutral, genuinely positive)
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