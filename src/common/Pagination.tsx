import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "../hooks/usePagination";
import "./pagination.scss";
import PropTypes from "prop-types";
import { PaginationProps } from "../interfaces/index";
import { Button, Form } from 'react-bootstrap';
/**
 * Pagination component
 * @param {PaginationProps} props - Props for Pagination component
 */
const Pagination = (props: PaginationProps) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    onPageSizeChange,
    otherHtml,
  } = props;

  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange?.length < 1) {
    return null;
  }
  /** Handle next page click */
  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  /** Handle previous page click  */
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  /** Handle page size change */
  const onChangePageSize = (event) => {
    onPageSizeChange(Number(event.target.value));
  };
/** Get last page from pagination range */
  const lastPage =
    paginationRange && paginationRange[paginationRange?.length - 1];

  if (lastPage) {
    return (
      <div className='pagination-container'>
        <div className='pagination-left'>
          <p className='mb-0'>{`${pageSize * (currentPage - 1) + 1}-${pageSize * currentPage}`} of {totalCount} items</p>
        </div>
        {/* {otherHtml ? <div>{otherHtml}</div> : ""} */}
        <div className='pagination-right'>
          <ul>
            <li key={Math.random()} className={classnames("previous", {
              disabled: currentPage === 1,
            })} ><Button size="sm" onClick={onPrevious}><i className='icon icon-arrow-left-2'></i></Button></li>


            {paginationRange?.map((pageNumber) => {
              if (pageNumber === DOTS) {
                return <li key={Math.random()} className="number"><Button size="sm">...</Button></li>;
              }

              return (
                <li
                  key={Math.random()}
                  className={classnames("number", {
                    active: pageNumber === currentPage,
                  })}

                ><Button size="sm" onClick={() => onPageChange(pageNumber)}>{pageNumber}</Button>

                </li>
              );
            })}
            <li key={Math.random()} className={classnames("next", {
              disabled: currentPage === lastPage,
            })}><Button size="sm" onClick={onNext}><i className='icon icon-arrow-right-3'></i></Button></li>
          </ul>
          <Form.Group className="form-group mb-0">
            <Form.Select size="sm" id="state"
              name="state"
              autoComplete="state"
              value={pageSize}
              onChange={onChangePageSize}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>
    );
  } else return <></>;
};

export default Pagination;

Pagination.prototype = {
  totalCount: PropTypes.number,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  className: PropTypes.string,
};
Pagination.defaultProps = {
  totalCount: 20,
  siblingCount: 1,
  currentPage: 1,
  pageSize: 20,
};
