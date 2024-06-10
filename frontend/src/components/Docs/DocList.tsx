import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DocList: React.FC = () =>
{
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/docs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setDocs(response.data);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Document List</h1>
      <ul>
        {docs.map((doc: any) => (
          <li key={doc.id}>
            <Link to={`/docs/${doc.id}`}>{doc.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocList;
