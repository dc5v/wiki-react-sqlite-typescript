import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '~/components/Pagination';

interface Log
{
  id: number;
  user_id: number;
  avatar: string;
  email: string;
  provider: string;
  uri: string;
  documentName: string;
  requestFunction: string;
  parameters: string;
  statusCode: number;
  ip: string;
  timestamp: string;
}

const LogList: React.FC = () =>
{
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  useEffect(() =>
  {
    const fetchLogs = async () =>
    {
      const response = await axios.get(`/api/logs?page=${currentPage}&pageSize=${pageSize}`);
      setLogs(response.data);
    };

    fetchLogs();
  }, [currentPage, pageSize]);

  return (
    <div className="log-list">
      <h2>Log List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Email</th>
            <th>Provider</th>
            <th>URI</th>
            <th>Document Name</th>
            <th>Request Function</th>
            <th>Parameters</th>
            <th>Status Code</th>
            <th>IP</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td><img src={log.avatar} alt="avatar" className="avatar" /></td>
              <td>{log.email}</td>
              <td>{log.provider}</td>
              <td>{log.uri}</td>
              <td>{log.documentName}</td>
              <td>{log.requestFunction}</td>
              <td>{log.parameters}</td>
              <td>{log.statusCode}</td>
              <td>{log.ip}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={logs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LogList;
