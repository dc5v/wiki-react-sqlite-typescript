import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const UserDetail: React.FC = () =>
{
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setUserData(response.data);
        });
    }
  }, [user, id]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Detail</h1>
      <p>Email: {userData.email}</p>
      <p>Provider: {userData.provider}</p>
      <p>Joined: {userData.joined}</p>
      <p>Last Login: {userData.lastLogin}</p>
      <p>Memo: {userData.memo}</p>
      <p>Group: {userData.group_id}</p>
      <p>Can View: {userData.canView ? 'Yes' : 'No'}</p>
      <p>Can Edit: {userData.canEdit ? 'Yes' : 'No'}</p>
      <p>Can Delete: {userData.canDelete ? 'Yes' : 'No'}</p>
      <p>Can Create: {userData.canCreate ? 'Yes' : 'No'}</p>
      <p>Is Banned: {userData.isBanned ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default UserDetail;
