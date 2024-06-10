import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () =>
{
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to the Wiki Engine</h1>
      {user ? (
        <div>
          <p>Hello, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      )}
    </div>
  );
};

export default Home;
