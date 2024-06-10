import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DocView from '../components/Docs/DocView';
import DocEdit from '../components/Docs/DocEdit';
import { useAuth } from '../contexts/AuthContext';

const WikiPage: React.FC = () =>
{
  const { '*': path } = useParams();
  const { user } = useAuth();

  const docPath = path ? `/${path}` : '/index';

  return (
    <div>
      {user ? (
        <>
          <DocView path={docPath} />
          <DocEdit path={docPath} />
        </>
      ) : (
        <p>Please log in to view or edit documents.</p>
      )}
    </div>
  );
};

export default WikiPage;
