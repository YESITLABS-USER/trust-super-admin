import React from 'react';

// PaginationControls component
const PaginationControls = ({ data, currentPage, setCurrentPage, rowsPerPage }) => {
    const totalPages = Math.ceil((data?.length || 0) / rowsPerPage); // Calculate total pages
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber); // Update the current page
        }
    };

    return (
        <div className="influ-pagi">
            {/* Pagination navigation */}
            <ul >
                {/* Previous Button */}
                <li
                    onClick={() => handlePageChange(currentPage - 1)}

                >
                    <a><i className="fas fa-chevron-left"></i></a>
                </li>

                {/* Page Numbers */}
                {[...Array(totalPages)?.keys()].map((num) => (
                    <li
                        key={num + 1}
                        onClick={() => handlePageChange(num + 1)}
                        className={currentPage === num + 1 ? "active" : ""}
                        style={{
                            // color: 'black'
                        }}
                    >
                        <a>{num + 1}</a>
                    </li>
                ))}
                {/* Next Button */}
                <li
                    className=""
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <a><i className="fas fa-chevron-right"></i></a>
                </li>
            </ul>
        </div>

    );
};

export default PaginationControls;
