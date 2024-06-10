import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const GroupDetail: React.FC = () =>
{
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const [groupData, setGroupData] = useState<any>(null);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/groups/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setGroupData(response.data);
        });
    }
  }, [user, id]);

  if (!groupData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Group Detail</h1>
      <p>Name: {groupData.name}</p>
      <p>Created At: {groupData.createdAt}</p>
      <p>Can View: {groupData.canView ? 'Yes' : 'No'}</p>
      <p>Can Edit: {groupData.canEdit ? 'Yes' : 'No'}</p>
      <p>Can Delete: {groupData.canDelete ? 'Yes' : 'No'}</p>
      <p>Can Create: {groupData.canCreate ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default GroupDetail;
