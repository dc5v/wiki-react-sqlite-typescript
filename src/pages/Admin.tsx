import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import UserList from '~/pages/UserList';
import GroupList from '~/pages/GroupList';
import PermissionList from '~/pages/PermissionList';
import LogList from '~/pages/LogList';

const Admin: React.FC = () =>
{
  const { path } = useRouteMatch();

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <Switch>
        <Route path={`${path}/users`} component={UserList} />
        <Route path={`${path}/groups`} component={GroupList} />
        <Route path={`${path}/permissions`} component={PermissionList} />
        <Route path={`${path}/logs`} component={LogList} />
      </Switch>
    </div>
  );
};

export default Admin;
