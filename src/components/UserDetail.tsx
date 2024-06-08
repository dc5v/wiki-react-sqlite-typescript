import React, { useState } from 'react';
import axios from 'axios';
import '~/styles/admin.css';

interface User
{
  id: number;
  email: string;
  provider: string;
  joined: string;
  lastLogin: string;
  memo: string;
  group: string;
  permissions: Record<string, boolean>;
  isBanned: boolean;
}

interface UserDetailProps
{
  user: User;
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) =>
{
  const [memo, setMemo] = useState<string>(user.memo);
  const [group, setGroup] = useState<string>(user.group);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(user.permissions);
  const [isBanned, setIsBanned] = useState<boolean>(user.isBanned);

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
  {
    setMemo(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setGroup(e.target.value);
  };

  const handlePermissionsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const updatedPermissions = { ...permissions, [e.target.name]: e.target.checked };
    setPermissions(updatedPermissions);
  };

  const handleBanChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setIsBanned(e.target.checked);
  };

  const handleSave = async () =>
  {
    await axios.put(`/api/users/${user.id}`, {
      memo,
      group,
      permissions,
      isBanned
    });
    alert('User details updated successfully');
  };

  return (
    <div className="user-detail card card-custom">
      <div className="card-header">
        <h3 className="card-title">User Details</h3>
      </div>
      <div className="card-body">
        <p>Email: {user.email}</p>
        <p>Provider: {user.provider}</p>
        <p>Joined: {user.joined}</p>
        <p>Last Login: {user.lastLogin}</p>
        <textarea value={memo} onChange={handleMemoChange} placeholder="Memo" className="form-control" />
        <input type="text" value={group} onChange={handleGroupChange} placeholder="Group" className="form-control" />
        <div className="form-group">
          <label>
            <input type="checkbox" name="canEdit" checked={permissions.canEdit} onChange={handlePermissionsChange} />
            Can Edit
          </label>
          <label>
            <input type="checkbox" name="canDelete" checked={permissions.canDelete} onChange={handlePermissionsChange} />
            Can Delete
          </label>
          <label>
            <input type="checkbox" name="canView" checked={permissions.canView} onChange={handlePermissionsChange} />
            Can View
          </label>
        </div>
        <label>
          <input type="checkbox" checked={isBanned} onChange={handleBanChange} />
          Banned
        </label>
        <button onClick={handleSave} className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default UserDetail;
