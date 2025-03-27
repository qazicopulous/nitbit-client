import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

// Define TypeScript types for the response data
type RssFeed = {
  rss: { [key: string]: any };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RssFeed | { error: string }>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the RSS URL from query parameters
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid RSS URL' });
  }

  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);

    const response = {rss: feed};

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}