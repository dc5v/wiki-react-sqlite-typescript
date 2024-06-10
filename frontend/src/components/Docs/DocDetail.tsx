import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const DocDetail: React.FC = () =>
{
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const [docData, setDocData] = useState<any>(null);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/docs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setDocData(response.data);
        });
    }
  }, [user, id]);

  if (!docData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Document Detail</h1>
      <p>Path: {docData.path}</p>
      <p>Name: {docData.name}</p>
      <p>Content: {docData.content}</p>
      <p>Version: {docData.version}</p>
      <p>Created At: {docData.createdAt}</p>
      <p>Created By: {docData.createdBy}</p>
    </div>
  );
};

export default DocDetail;
