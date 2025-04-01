import { useMemo } from "react";

export const DOTS = "...";
/**
 * Generates a range of numbers from start to end inclusive
 * @param start - Start of the range
 * @param end - End of the range
 * @returns An array containing numbers from start to end inclusive
 */
const range = (start: number, end: number): number[] => {
  const length: number = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
/**
 * Custom hook for pagination logic
 * @param totalCount - Total count of items
 * @param pageSize - Number of items per page
 * @param siblingCount - Number of sibling pages to show on each side of the current page
 * @param currentPage - Current page number
 * @returns An array representing the range of page numbers to be displayed
 */
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo<(string | number)[] | undefined>(() => {
    const totalPageCount: number = Math.ceil(totalCount / pageSize);
    
    /**Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS  */
    const totalPageNumbers: number = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex: number = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex: number = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots: boolean = leftSiblingIndex > 2;
    const shouldShowRightDots: boolean = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex: number = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount: number = 3 + 2 * siblingCount;
      const leftRange: number[] = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount: number = 3 + 2 * siblingCount;
      const rightRange: number[] = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange: number[] = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
