import { Router } from 'express';
import { postTweet } from '../controllers/tweetController';

const router = Router();

router.post("/tweet", postTweet);

export default router; 