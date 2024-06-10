import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DocList from '../components/Docs/DocList';
import DocDetail from '../components/Docs/DocDetail';

const DocPage: React.FC = () =>
{
  return (
    <Routes>
      <Route path="/" element={<DocList />} />
      <Route path=":id" element={<DocDetail />} />
    </Routes>
  );
};

export default DocPage;
