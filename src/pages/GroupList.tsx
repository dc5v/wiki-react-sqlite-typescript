import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GroupDetail from '~/components/GroupDetail';
import Pagination from '~/components/Pagination';

interface Group
{
  id: number;
  name: string;
  createdAt: string;
  permissions: string;
}

const GroupList: React.FC = () =>
{
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  useEffect(() =>
  {
    const fetchGroups = async () =>
    {
      const response = await axios.get(`/api/groups?page=${currentPage}&pageSize=${pageSize}`);
      setGroups(response.data);
    };

    fetchGroups();
  }, [currentPage, pageSize]);

  return (
    <div className="group-list">
      <h2>Group List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id} onClick={() => setSelectedGroup(group)}>
              <td>{group.name}</td>
              <td>{group.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={groups.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
      {selectedGroup && <GroupDetail group={selectedGroup} />}
    </div>
  );
};

export default GroupList;
