import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  delta?: number;
  showPageIndicator?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  disabledClassName?: string;
  pageIndicatorClassName?: string;
}

const SmartPagination: React.FC<SmartPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  delta = 2,
  showPageIndicator = false,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
  activeClassName = 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700',
  inactiveClassName = 'text-gray-700 hover:bg-gray-100',
  disabledClassName = 'opacity-50 cursor-not-allowed',
  pageIndicatorClassName = 'text-center mt-4 text-sm text-gray-500'
}) => {
  const getPageNumbers = (): Array<number | string> => {
    const range: number[] = [];
    const rangeWithDots: Array<number | string> = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (totalPages > 0) {
      rangeWithDots.push(1);
    }

    for (let i = 0; i < range.length; i++) {
      if (
        typeof rangeWithDots[rangeWithDots.length - 1] === 'number' &&
        range[i] - (rangeWithDots[rangeWithDots.length - 1] as number) !== 1
      ) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(range[i]);
    }

    if (totalPages > 1 && range[range.length - 1] !== totalPages - 1) {
      rangeWithDots.push('...');
    }

    if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={`mr-2 hover:bg-gray-100 transition-all duration-200 rounded-xl ${
              currentPage === 1 ? disabledClassName : ''
            }`}
            aria-disabled={currentPage === 1}
          >
            {prevLabel}
          </PaginationPrevious>

          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <PaginationEllipsis key={`ellipsis-${index}`} />
            ) : (
              <PaginationLink
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`mx-1 transition-all duration-200 rounded-xl ${
                  currentPage === page ? activeClassName : inactiveClassName
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            )
          )}

          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={`ml-2 hover:bg-gray-100 transition-all duration-200 rounded-xl ${
              currentPage === totalPages ? disabledClassName : ''
            }`}
            aria-disabled={currentPage === totalPages}
          >
            {nextLabel}
          </PaginationNext>
        </PaginationContent>
      </Pagination>

      {showPageIndicator && (
        <div className={pageIndicatorClassName}>
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default SmartPagination;
