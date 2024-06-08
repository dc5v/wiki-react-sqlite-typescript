import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const AuthProvider: React.FC = ({ children }) =>
{
  const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;

  const history = useHistory();

  const onRedirectCallback = (appState: any) =>
  {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain= { domain };
  clientId = { clientId };
  redirectUri = { window.location.origin };
  onRedirectCallback = { onRedirectCallback }
    >
    { children }
    < /Auth0Provider>
  );
};

export default AuthProvider;

export const useAuth = () =>
{
  const auth = useAuth0();
  const token = auth.isAuthenticated ? auth.getAccessTokenSilently() : null;

  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

  return auth;
};
