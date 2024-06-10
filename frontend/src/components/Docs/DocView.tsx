import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DocViewProps
{
  path: string;
}

const DocView: React.FC<DocViewProps> = ({ path }) =>
{
  const [doc, setDoc] = useState<any>(null);

  useEffect(() =>
  {
    axios
      .get(`${process.env.REACT_APP_API_URL}/docs/path${path}`)
      .then((response) =>
      {
        setDoc(response.data);
      })
      .catch(() =>
      {
        setDoc(null);
      });
  }, [path]);

  if (!doc) return <div>No document found at this path. You can create a new document.</div>;

  return (
    <div>
      <h1>{doc.name}</h1>
      <p>{doc.content}</p>
    </div>
  );
};

export default DocView;
