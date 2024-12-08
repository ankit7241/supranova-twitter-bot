import { scraper } from './scraper';
import { supabase } from '../config/supabase';
import { storeTweet } from './db';

// Export these for tweetController
export let activeMonitors: { [key: string]: boolean } = {};
export let lastCheck: { [key: string]: Date } = {};

async function checkMentions(): Promise<void> {
  try {
    console.log('\n🔍 Checking for new mentions...');
    const query = `@${process.env.TWITTER_USERNAME}`;
    const maxMentions = 20;
    const searchMode = 1;

    for await (const tweet of scraper.searchTweets(query, maxMentions, searchMode)) {
      if (tweet.username !== process.env.TWITTER_USERNAME) {
        console.log(`
🔔 Found mention:
👤 From: @${tweet.username}
💬 Text: ${tweet.text}
🆔 Tweet ID: ${tweet.id}
        `);

        // Reply to the mention
        try {
          await scraper.sendTweet(
            "Sorry we don't have enough funds",
            tweet.id
          );
          console.log(`✅ Replied to @${tweet.username}`);
        } catch (error) {
          console.error('❌ Failed to reply:', error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error checking mentions:', error);
  }
}

// Export the monitor function
export const startQuoteMonitor = () => {
  console.log('🤖 Starting mention monitor...');
  setInterval(checkMentions, 30000);
};