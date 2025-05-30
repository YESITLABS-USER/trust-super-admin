import { Link } from 'react-router-dom';


const PaginationControls = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="influ-pagi">
            <ul>
                <li>
                    <Link to="#" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <i className="fas fa-chevron-left"></i>
                    </Link>
                </li>
                {pages.map((page) => (
                    <li key={page} className={page === currentPage ? 'active' : ''}>
                        <Link to="#" onClick={() => onPageChange(page)}>{page}</Link>
                    </li>
                ))}
                <li>
                    <Link to="#" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <i className="fas fa-chevron-right"></i>
                    </Link>
                </li>
            </ul>
            <p>Showing {totalItems === 0 ? 0 : `${start}–${end}`} of {totalItems} results</p>
        </div>
    )
}

export default PaginationControls