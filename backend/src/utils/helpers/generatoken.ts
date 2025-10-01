import { Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (res: Response, userId: string, roleId: number) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    // Generate access token for 1 hour
    const accessToken = jwt.sign({ userId, roleId }, jwtSecret, { expiresIn: '1h' });

    // Set access token as HTTP-Only cookie (optional, since frontend uses response)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return { accessToken };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Error generating authentication token');
  }
};