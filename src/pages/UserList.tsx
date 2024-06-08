import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetail from '~/components/UserDetail';
import Pagination from '~/components/Pagination';
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

const UserList: React.FC = () =>
{
  const [users, setUsers] = useState<User[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() =>
  {
    fetchUsers();
  }, [searchKeyword, searchColumn, pageSize, currentPage]);

  const fetchUsers = async () =>
  {
    const response = await axios.get('/api/users', {
      params: {
        search: searchKeyword,
        column: searchColumn,
        pageSize,
        page: currentPage
      }
    });
    setUsers(response.data);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setSearchKeyword(e.target.value);
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  {
    setSearchColumn(e.target.value);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handlePageChange = (page: number) =>
  {
    setCurrentPage(page);
  };

  const handleUserClick = (user: User) =>
  {
    setSelectedUser(user);
  };

  return (
    <div className="admin-container">
      <h1>User Management</h1>
      <div className="search-container">
        <input type="text" placeholder="Search..." value={searchKeyword} onChange={handleSearch} />
        <select value={searchColumn} onChange={handleColumnChange}>
          <option value="">All Columns</option>
          <option value="email">Email</option>
          <option value="provider">Provider</option>
          {/* Add more columns as needed */}
        </select>
        <select value={pageSize} onChange={handlePageSizeChange}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Provider</th>
            <th>Joined</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} onClick={() => handleUserClick(user)}>
              <td>{user.email}</td>
              <td>{user.provider}</td>
              <td>{user.joined}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {selectedUser && <UserDetail user={selectedUser} />}
    </div>
  );
};

export default UserList;
