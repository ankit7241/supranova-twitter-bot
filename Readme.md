# Twitter Bot Service 🤖

A TypeScript-based Twitter bot service that monitors mentions and responds with AI-generated responses. Built with Express.js and Supabase for data persistence.

## Features 🌟

- **AI-Powered Responses**: Automatically generates contextual responses to mentions using AI
- **Quote Tweet Monitoring**: Tracks and stores quote tweets for monitored tweets
- **Persistent Storage**: Uses Supabase to store tweet data and interactions
- **Cookie-based Authentication**: Secure Twitter authentication using cookies
- **Real-time Monitoring**: Checks for new mentions every 30 seconds
- **REST API Endpoints**: Express.js based API for tweet management
- **Automated Tweet Storage**: Stores all tweets and responses in Supabase

## Tech Stack 💻

- **Backend**: Node.js + Express.js + TypeScript
- **Twitter Integration**: agent-twitter-client
- **Database**: Supabase
- **Scheduling**: node-cron
- **Authentication**: Cookie-based Twitter auth
- **HTTP Client**: Axios for AI API integration
- **Development**: Nodemon + ts-node for hot reloading

## Architecture Diagram 🏗️

```mermaid
graph TD
    A[Express Server] --> B[Tweet Controller]
    B --> C[Twitter Scraper Service]
    B --> D[Monitor Service]
    B --> E[Auth Service]
    C --> F[Twitter API]
    B --> G[Database Service]
    G --> H[Supabase]
    D --> C
    E --> C
    C --> I[AI Service]
    I --> J[External AI API]

    subgraph Monitoring Flow
    K[Mention Detection] --> L[AI Processing]
    L --> M[Response Generation]
    M --> N[Tweet Storage]
    end
```

## System Flow 🔄

```mermaid
sequenceDiagram
    participant U as User Mention
    participant B as Bot Service
    participant A as AI Service
    participant T as Twitter API
    participant D as Database

    U->>B: Mentions Bot
    B->>T: Detect Mention
    B->>A: Request Response
    A->>B: Generate Response
    B->>T: Post Reply
    B->>D: Store Interaction
```

## API Endpoints 🛣️

- `POST /tweet`: Create a new tweet
  - Body: `{ "text": "Tweet content" }`
  - Response: Tweet object with monitoring status

## Database Schema 📊

**tweets table**

- `id`: string (primary key)
- `text`: string
- `created_at`: timestamp
- `author_id`: string
- `is_quote_tweet`: boolean
- `original_tweet_id`: string (nullable)

## Environment Variables 🔐

```env
PORT=3001
TWITTER_USERNAME=your_username
TWITTER_PASSWORD=your_password
TWITTER_EMAIL=your_email
TWITTER_COOKIES=your_cookies
TWITTER_CT0=your_ct0
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
AI_API_URL=your_ai_api_url
```

## Getting Started 🚀

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`
4. Run development server:
   ```bash
   npm run dev
   ```

## Development Scripts 📜

- `npm run dev`: Start development server with hot-reload using nodemon and ts-node
- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Watch mode for TypeScript compilation
- `npm start`: Run production server from compiled JS

## Project Structure 📁

```
src/
├── app.ts                 # Application entry point
├── config/               # Configuration files
│   └── supabase.ts      # Supabase client setup
├── controllers/          # Request handlers
│   └── tweetController.ts
├── routes/              # API routes
│   └── tweet.routes.ts
├── services/            # Business logic
│   ├── auth.ts         # Twitter authentication
│   ├── db.ts           # Database operations
│   ├── monitor.ts      # Tweet monitoring
│   └── scraper.ts      # Twitter scraping + AI
└── types/              # TypeScript definitions
    └── global.d.ts
```

## Features Deep Dive 🔍

### AI Integration

- Uses external AI API for generating contextual responses
- Maintains conversation thread IDs for context
- Fallback response handling for API failures

### Twitter Integration

- Cookie-based authentication for reliable access
- Real-time mention monitoring
- Quote tweet tracking
- Automated response system

### Data Persistence

- Stores all tweets and responses
- Tracks conversation threads
- Monitors tweet engagement

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

ISC
