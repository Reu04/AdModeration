import type { PaginationPropsType } from "../types/adsTypes";

import BaselineArrowBack from "./svg-icons/BaselineArrowBack";
import BaselineArrowForward from "./svg-icons/BaselineArrowForward";

export default function Pagination({ pagination, setPage }: PaginationPropsType) {
    if (!pagination) return null;

    const { currentPage, totalPages } = pagination;

    const handlePrevPage = () => {
        setPage((page) => (page > 1 ? page - 1 : page));
    };

    const handleNextPage = () => {
        setPage((page) => {
            if (page < totalPages) {
                return page + 1;
            }
            return page;
        });
    };

    return (
        <div className="ad-pagination">
            <button
                type="button"
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
                <BaselineArrowBack className="pagination-icon" />
                <span className="pagination-text">Назад</span>
            </button>

            <span className="pagination-current">
                {currentPage} / {totalPages}
            </span>

            <button
                type="button"
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                <span className="pagination-text">Вперёд</span>
                <BaselineArrowForward className="pagination-icon" />
            </button>
        </div>
    );
}