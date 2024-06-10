import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GroupList: React.FC = () =>
{
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/groups`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setGroups(response.data);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Group List</h1>
      <ul>
        {groups.map((group: any) => (
          <li key={group.id}>
            <Link to={`/groups/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
