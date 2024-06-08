export interface User
{
  id: number;
  email: string;
  provider: string;
  joined: string;
  lastLogin: string;
  memo: string;
  group: string;
  permissions: Record<string, boolean>;
  isBanned: boolean;
}

export interface Group
{
  id: number;
  name: string;
  createdAt: string;
  permissions: string;
}

export interface Permission
{
  id: number;
  pattern: string;
  accessLevel: string;
}

export interface Log
{
  id: number;
  user_id: number;
  avatar: string;
  email: string;
  provider: string;
  uri: string;
  documentName: string;
  requestFunction: string;
  parameters: string;
  statusCode: number;
  ip: string;
  timestamp: string;
}
