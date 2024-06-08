import React from 'react';
import { useAuth } from '~/utils/auth';

const Login: React.FC = () =>
{
  const { loginWithRedirect } = useAuth();

  return (
    <div>
      <button onClick={() => loginWithRedirect({ connection: 'google' })}>Login with Google</button>
      <button onClick={() => loginWithRedirect({ connection: 'github' })}>Login with GitHub</button>
      <button onClick={() => loginWithRedirect({ connection: 'microsoft' })}>Login with Microsoft</button>
    </div>
  );
};

export default Login;
