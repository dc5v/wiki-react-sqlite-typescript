import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, User } from './utils/types';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (user: User) =>
{
  return jwt.sign({ id: user.id, email: user.email, provider: user.provider, canView: user.canView, canEdit: user.canEdit, canDelete: user.canDelete, canCreate: user.canCreate }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) =>
  {
    if (err) return res.sendStatus(403);
    req.user = user as User;
    next();
  });
};

export const authorizePermission = (requiredPermission: keyof User) =>
{
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  {
    const userPermission = req.user?.[requiredPermission];
    if (userPermission)
    {
      next();
    } else
    {
      res.sendStatus(403);
    }
  };
};

export const hashPassword = async (password: string) =>
{
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) =>
{
  return bcrypt.compare(password, hash);
};
