declare module 'agent-twitter-client' {
  export class Scraper {
    constructor();
    login(username: string, password: string, email?: string): Promise<void>;
    isLoggedIn(): Promise<boolean>;
    sendTweet(text: string, replyToTweetId?: string, mediaData?: any): Promise<any>;
    getTweet(id: string): Promise<Tweet | null>;
    searchTweets(query: string, maxTweets: number, searchMode?: number): AsyncGenerator<Tweet, void, unknown>;
    setCookies(cookies: string[]): Promise<void>;
    getCookies(): Promise<any[]>;
  }

  interface TweetInterface {
    id?: string;
    text: string;
    authorId?: string;
    createdAt?: string;
    username?: string;
    inReplyToStatusId?: string;
    photos?: { url: string }[];
  }
} 