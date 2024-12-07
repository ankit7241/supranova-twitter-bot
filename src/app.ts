import express from "express";
import dotenv from "dotenv";
import tweetRoutes from './routes/tweet.routes';
import { loginWithCookies } from './services/auth';
import { startMonitoringExistingTweets, startQuoteMonitor } from './services/monitor';

dotenv.config();

const app = express();
app.use(express.json());
app.use(tweetRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loginWithCookies();
  await startMonitoringExistingTweets();
  startQuoteMonitor();
});
