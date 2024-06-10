import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType
{
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) =>
{
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() =>
  {
    const token = localStorage.getItem('token');
    if (token)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) =>
        {
          setUser(response.data);
        })
        .catch(() =>
        {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const login = async (email: string, password: string) =>
  {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    navigate('/');
  };

  const logout = () =>
  {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType =>
{
  const context = useContext(AuthContext);
  if (!context)
  {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
