import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '~/styles/admin.css';

interface Group
{
  id: number;
  name: string;
  createdAt: string;
  permissions: Record<string, boolean>;
}

interface GroupDetailProps
{
  group: Group;
}

interface User
{
  id: number;
  email: string;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group }) =>
{
  const [groupName, setGroupName] = useState<string>(group.name);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(group.permissions);

  useEffect(() =>
  {
    fetchGroupUsers();
  }, []);

  const fetchGroupUsers = async () =>
  {
    const response = await axios.get(`/api/groups/${group.id}/users`);
    setUsers(response.data);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setGroupName(e.target.value);
  };

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) =>
  {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setSelectedUsers(selectedOptions);
  };

  const handlePermissionsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const updatedPermissions = { ...permissions, [e.target.name]: e.target.checked };
    setPermissions(updatedPermissions);
  };

  const handleSave = async () =>
  {
    await axios.put(`/api/groups/${group.id}`, {
      name: groupName,
      permissions
    });
    await axios.post(`/api/groups/${group.id}/users`, { users: selectedUsers });
    alert('Group details updated successfully');
  };

  const handleDelete = async () =>
  {
    if (window.confirm('Are you sure you want to delete this group?'))
    {
      await axios.delete(`/api/groups/${group.id}`);
      alert('Group deleted successfully');
      // Handle group deletion logic (e.g., remove from state)
    }
  };

  return (
    <div className="group-detail">
      <h2>Group Details</h2>
      <input type="text" value={groupName} onChange={handleGroupNameChange} placeholder="Group Name" />
      <div>
        <label>
          <input type="checkbox" name="canEdit" checked={permissions.canEdit} onChange={handlePermissionsChange} />
          Can Edit
        </label>
        <label>
          <input type="checkbox" name="canDelete" checked={permissions.canDelete} onChange={handlePermissionsChange} />
          Can Delete
        </label>
        {/* Add more permissions as needed */}
      </div>
      <select multiple value={selectedUsers} onChange={handleUserSelection}>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.email}</option>
        ))}
      </select>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete Group</button>
    </div>
  );
};

export default GroupDetail;
