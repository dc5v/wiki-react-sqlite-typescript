import { Request } from 'express';

export interface User
{
  id: string;
  email: string;
  provider: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export interface AuthenticatedRequest extends Request
{
  user?: User;
}
