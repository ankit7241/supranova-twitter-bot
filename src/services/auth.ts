import { scraper } from './scraper';

export const loginWithCookies = async () => {
  try {
    const authToken = process.env.TWITTER_COOKIES?.split('auth_token=')[1];
    const ct0 = process.env.TWITTER_CT0?.split('ct0=')[1];
    
    if (!authToken || !ct0) {
      throw new Error("Required cookies not found");
    }

    const cookies = [
      `auth_token=${authToken}; Domain=twitter.com; Path=/; Secure; HttpOnly`,
      `ct0=${ct0}; Domain=twitter.com; Path=/; Secure`
    ];

    await scraper.setCookies(cookies);
    const isLoggedIn = await scraper.isLoggedIn();
    
    if (!isLoggedIn) {
      throw new Error('Failed to login with cookies');
    }
    
    console.log('Successfully logged in using cookies');
  } catch (error) {
    console.error('Login failed:', error);
  }
}; 