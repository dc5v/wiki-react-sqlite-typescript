import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () =>
{
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() =>
  {
    if (user)
    {
      axios
        .get(`${process.env.REACT_APP_API_URL}/settings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) =>
        {
          setSettings(response.data);
        });
    }
  }, [user]);

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <h1>Settings</h1>
      <p>Wiki Name: {settings.wikiName}</p>
      <p>Style File: {settings.styleFileName}</p>
      <p>Can Anyone Read: {settings.canAnyoneRead ? 'Yes' : 'No'}</p>
      <p>Can Anyone Write: {settings.canAnyoneWrite ? 'Yes' : 'No'}</p>
      <p>Restricted Paths: {settings.restrictedPaths}</p>
    </div>
  );
};

export default Settings;
