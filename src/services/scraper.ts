import { Scraper } from "agent-twitter-client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const scraper = new Scraper();

// Initialize scraper with cookies
const initializeScraper = async () => {
  try {
    const authToken = process.env.TWITTER_COOKIES?.split("auth_token=")[1];
    const ct0 = process.env.TWITTER_CT0?.split("ct0=")[1];

    if (!authToken || !ct0) {
      throw new Error("Required cookies not found");
    }

    const cookies = [
      `auth_token=${authToken}; Domain=twitter.com; Path=/; Secure; HttpOnly`,
      `ct0=${ct0}; Domain=twitter.com; Path=/; Secure`,
    ];

    await scraper.setCookies(cookies);
    const isLoggedIn = await scraper.isLoggedIn();

    if (isLoggedIn) {
      console.log("Scraper initialized and logged in successfully");
    } else {
      throw new Error("Failed to login with cookies");
    }
  } catch (error) {
    console.error("Scraper initialization failed:", error);
    throw error;
  }
};

export const getAIRecommendation = async (text: string, chatId: string): Promise<string> => {
  try {
    const { data } = await axios.post(`${process.env.AI_API_URL}/v1/invoke`, {
      message: text,
      threadId: chatId,
    });
    return data.message;
  } catch (err) {
    return "Unable to reach the AI server, oops!";
  }
};

// Initialize immediately
initializeScraper().catch(console.error);

export { scraper };
