import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GroupList from '../components/Groups/GroupList';
import GroupDetail from '../components/Groups/GroupDetail';

const GroupPage: React.FC = () =>
{
  return (
    <Routes>
      <Route path="/" element={<GroupList />} />
      <Route path=":id" element={<GroupDetail />} />
    </Routes>
  );
};

export default GroupPage;
