import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserList: React.FC = () =>
{
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setUsers(response.data);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.email}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
