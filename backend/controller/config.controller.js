import dotenv from 'dotenv';
dotenv.config();

export const getConfig = (req, res) => {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not found" });
  res.json({ youtubeApiKey: apiKey });
};
