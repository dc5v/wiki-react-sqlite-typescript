import React from 'react';
import '~/styles/pagination.css';

interface PaginationProps
{
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) =>
{
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (page: number) =>
  {
    if (page >= 1 && page <= totalPages)
    {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => handlePageClick(i + 1)}
          className={i + 1 === currentPage ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
