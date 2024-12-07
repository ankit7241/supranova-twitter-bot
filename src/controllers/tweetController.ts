import { Request, Response } from 'express';
import { scraper } from '../services/scraper';
import { storeTweet } from '../services/db';
import { loginWithCookies } from '../services/auth';
import { activeMonitors, lastCheck } from '../services/monitor';

export const postTweet = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!await scraper.isLoggedIn()) {
      await loginWithCookies();
    }

    if (!text) {
      throw new Error('Tweet text is required');
    }

    const response = await scraper.sendTweet(text);
    const tweet = await response.json();
    const tweetId = tweet?.data?.create_tweet?.tweet_results?.result?.rest_id;

    if (!tweetId) {
      throw new Error('Failed to get tweet ID from response');
    }

    const storedTweet = {
      id: tweetId,
      text: text,
      created_at: new Date().toISOString(),
      author_id: process.env.TWITTER_USERNAME || 'unknown',
      is_quote_tweet: false,
    };

    await storeTweet(storedTweet);
    
    activeMonitors[tweetId] = true;
    lastCheck[tweetId] = new Date();

    res.json({ 
      tweet: storedTweet,
      monitoring: true 
    });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}; 