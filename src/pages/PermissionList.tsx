import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '~/components/Pagination';

interface Permission
{
  id: number;
  pattern: string;
  accessLevel: string;
}

const PermissionList: React.FC = () =>
{
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  useEffect(() =>
  {
    const fetchPermissions = async () =>
    {
      const response = await axios.get(`/api/permissions?page=${currentPage}&pageSize=${pageSize}`);
      setPermissions(response.data);
    };

    fetchPermissions();
  }, [currentPage, pageSize]);

  return (
    <div className="permission-list">
      <h2>Permission List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Access Level</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map(permission => (
            <tr key={permission.id}>
              <td>{permission.pattern}</td>
              <td>{permission.accessLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={permissions.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PermissionList;
