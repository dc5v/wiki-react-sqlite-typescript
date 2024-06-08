import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '~/components/Navbar';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Page from '~/pages/Page';
import Admin from '~/pages/Admin';
import AuthProvider from '~/utils/auth';

const App: React.FC = () =>
{
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/page" component={Page} />
            <Route path="/admin" component={Admin} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
