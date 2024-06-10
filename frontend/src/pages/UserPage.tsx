import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserList from '../components/Users/UserList';
import UserDetail from '../components/Users/UserDetail';

const UserPage: React.FC = () =>
{
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path=":id" element={<UserDetail />} />
    </Routes>
  );
};

export default UserPage;
