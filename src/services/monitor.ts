import { supabase } from '../config/supabase';
import { scraper } from './scraper';
import { storeTweet } from './db';

declare global {
  var PLATFORM_NODE: boolean;
  var PLATFORM_NODE_JEST: boolean;
}

export let activeMonitors: { [key: string]: boolean } = {};
export let lastCheck: { [key: string]: Date } = {};

export const checkQuoteTweets = async (tweetId: string) => {
  const now = new Date();
  const thirtySecondsAgo = new Date(now.getTime() - 3000000);
  console.log(`\n[${now.toLocaleTimeString()}] Checking quotes since ${thirtySecondsAgo.toLocaleTimeString()}`);

  try {
    const { data: baseTweets } = await supabase
      .from('tweets')
      .select('id')
      .eq('is_quote_tweet', false);

    if (!baseTweets?.length) return;

    for (const baseTweet of baseTweets) {
      const quotes: any[] = [];
      
      // Search for quotes using Twitter's search syntax
      const query = `quoted_tweet_id:${baseTweet.id}`;
      console.log(`Searching quotes for tweet ${baseTweet.id}`);

      try {
        // Set platform flags
        globalThis.PLATFORM_NODE = true;
        globalThis.PLATFORM_NODE_JEST = false;

        // Fetch quotes using searchTweets
        for await (const tweet of scraper.searchTweets(query, 100, 1)) {
          // Check if it's actually a quote tweet
          if (tweet.quotedStatusId === baseTweet.id) {
            quotes.push(tweet);
            console.log('Found quote tweet:', tweet.id);
          }
        }

        console.log(`Found ${quotes.length} quotes for tweet ${baseTweet.id}`);

        // Store new quotes
        for (const quote of quotes) {
          const { data: existingQuote } = await supabase
            .from('tweets')
            .select('id')
            .eq('id', quote.id)
            .single();

          if (!existingQuote) {
            await storeTweet({
              id: quote.id,
              //@ts-ignore
              text: quote.text || '',
              created_at: new Date(quote.timestamp * 1000).toISOString(),
              //@ts-ignore
              author_id: quote.authorId || quote.username || 'unknown',
              is_quote_tweet: true,
              original_tweet_id: baseTweet.id
            });
            console.log('Stored new quote:', quote.id);
          }
        }
      } catch (searchError) {
        console.error(`Error searching quotes for tweet ${baseTweet.id}:`, searchError);
      }
    }

    lastCheck[tweetId] = now;
  } catch (error) {
    console.error("Error checking quotes:", error);
  }
};

export const startMonitoringExistingTweets = async () => {
  try {
    const { data: baseTweets } = await supabase
      .from('tweets')
      .select('id')
      .eq('is_quote_tweet', false);

    if (baseTweets?.length) {
      console.log(`Found ${baseTweets.length} tweets to monitor`);
      baseTweets.forEach(tweet => {
        activeMonitors[tweet.id] = true;
        lastCheck[tweet.id] = new Date();
      });
    }
  } catch (error) {
    console.error('Error starting monitors:', error);
  }
};

export const startQuoteMonitor = () => {
  setInterval(async () => {
    const monitoredTweets = Object.keys(activeMonitors).filter(id => activeMonitors[id]);
    if (monitoredTweets.length === 0) return;

    console.log(`\n🔄 Checking ${monitoredTweets.length} tweets at ${new Date().toLocaleTimeString()}`);
    for (const tweetId of monitoredTweets) {
      await checkQuoteTweets(tweetId);
    }
  }, 30000);
}; 