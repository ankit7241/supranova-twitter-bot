import { supabase } from '../config/supabase';

interface StoredTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  is_quote_tweet: boolean;
  original_tweet_id?: string;
}

export const storeTweet = async (tweet: StoredTweet) => {
  try {
    const { error } = await supabase.from('tweets').insert([{
      id: tweet.id,
      text: tweet.text,
      created_at: new Date(tweet.created_at).toISOString(),
      author_id: tweet.author_id,
      is_quote_tweet: tweet.is_quote_tweet,
      original_tweet_id: tweet.original_tweet_id
    }]);
    
    if (error) throw error;
    console.log(`Stored ${tweet.is_quote_tweet ? 'quote' : 'original'} tweet: ${tweet.id}`);
  } catch (error) {
    console.error('Error storing tweet:', error);
  }
}; 