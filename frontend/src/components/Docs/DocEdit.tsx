import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface DocEditProps
{
  path: string;
}

const DocEdit: React.FC<DocEditProps> = ({ path }) =>
{
  const { user } = useAuth();
  const [content, setContent] = useState<string>('');
  const [doc, setDoc] = useState<any>(null);

  useEffect(() =>
  {
    axios
      .get(`${process.env.REACT_APP_API_URL}/docs/path${path}`)
      .then((response) =>
      {
        setDoc(response.data);
        setContent(response.data.content);
      })
      .catch(() =>
      {
        setDoc(null);
        setContent('');
      });
  }, [path]);

  const handleSave = async () =>
  {
    if (doc)
    {
      await axios.put(`${process.env.REACT_APP_API_URL}/docs/${doc.id}`, { content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Document updated successfully');
    } else
    {
      await axios.post(`${process.env.REACT_APP_API_URL}/docs`, { path, name: path.split('/').pop(), content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Document created successfully');
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2>Edit Document</h2>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default DocEdit;
