import express, { Request, Response } from 'express';
import axios from 'axios';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { generateToken } from '../auth';
import { idGen } from '../utils/idGen';
import { AuthenticatedRequest } from '../utils/types';
import 'dotenv/config';

const router = express.Router();

const getOAuthToken = async (url: string, params: any) =>
{
  const response = await axios.post(url, null, { params });
  return response.data;
};

const getUserInfo = async (url: string, headers: any) =>
{
  const response = await axios.get(url, { headers });
  return response.data;
};

router.get('/google', (req: Request, res: Response) =>
{
  const redirectUri = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=email%20profile&state=google`;
  res.redirect(redirectUri);
});

router.get('/github', (req: Request, res: Response) =>
{
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user:email&state=github`;
  res.redirect(redirectUri);
});

router.get('/microsoft', (req: Request, res: Response) =>
{
  const redirectUri = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=user.read&state=microsoft`;
  res.redirect(redirectUri);
});

router.get('/callback', async (req: Request, res: Response) =>
{
  const { code, state } = req.query;
  const redirectUri = process.env.REDIRECT_URI;

  let tokenUrl = '';
  let userInfoUrl = '';
  let params: any = {};
  let headers: any = {};

  switch (state)
  {
    case 'google':
      tokenUrl = 'https://oauth2.googleapis.com/token';
      userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
      params = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      };
      break;
    case 'github':
      tokenUrl = 'https://github.com/login/oauth/access_token';
      userInfoUrl = 'https://api.github.com/user';
      params = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      };
      headers = {
        Accept: 'application/json'
      };
      break;
    case 'microsoft':
      tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      userInfoUrl = 'https://graph.microsoft.com/v1.0/me';
      params = {
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'user.read'
      };
      break;
    default:
      return res.status(400).json({ message: 'Invalid state parameter' });
  }

  try
  {
    const tokenData = await getOAuthToken(tokenUrl, params);
    const accessToken = tokenData.access_token || tokenData.id_token;
    const userInfo = await getUserInfo(userInfoUrl, { Authorization: `Bearer ${accessToken}` });

    const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
    let user = await db.get('SELECT * FROM users WHERE email = ? AND provider = ?', [userInfo.email, state]);

    if (!user)
    {
      const userId = await idGen();
      await db.run('INSERT INTO users (id, email, provider, provider_id, joined) VALUES (?, ?, ?, ?, ?)', [userId, userInfo.email, state, userInfo.id, new Date().toISOString()]);
      user = await db.get('SELECT * FROM users WHERE email = ? AND provider = ?', [userInfo.email, state]);
    }

    const token = generateToken(user);
    res.redirect(`http://localhost:3000?token=${token}`);
  } catch (error)
  {
    console.error(error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

export default router;
