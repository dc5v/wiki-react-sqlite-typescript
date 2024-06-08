import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~/utils/auth';
import '~/styles/navbar.css';

const Navbar: React.FC = () =>
{
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Wiki Engine</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          )}
        </ul>
        {isAuthenticated && (
          <div className="user-info">
            <img src={user?.picture} alt="Avatar" />
            <span>{user?.email}</span>
            <button className="btn btn-link" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
