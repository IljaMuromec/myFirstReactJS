import React, { useState } from "react";
import { useCallback } from "react";

const Pagination = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  const [pageNumberLimit] = useState(6);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(6);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  //page btn right
  const handleNextBtn = useCallback(() => {
    if (currentPage <= pageNumbers.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      return null;
    }

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  }, [
    currentPage,
    maxPageNumberLimit,
    minPageNumberLimit,
    pageNumberLimit,
    setCurrentPage,
    pageNumbers.length,
  ]);

  let pageIncreementBtn = null;
  if (pageNumbers.length > maxPageNumberLimit) {
    pageIncreementBtn = <li onClick={handleNextBtn}>&hellip;</li>;
  }

  //page btn left
  const handlePrevBtn = useCallback(() => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    } else {
      return null;
    }

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  }, [
    currentPage,
    maxPageNumberLimit,
    minPageNumberLimit,
    pageNumberLimit,
    setCurrentPage,
  ]);

  let pageDecreementBtn = null;
  if (pageNumbers.length > maxPageNumberLimit) {
    pageDecreementBtn = <li onClick={handlePrevBtn}>&hellip;</li>;
  }

  //show pagination buttons
  const showPages = pageNumbers.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={() => paginate(number)}
          className={currentPage === number ? "page-item active" : null}
        >
          <div className="page-link">{number}</div>
        </li>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      <div className="center">
        <ul className="pagination">
          <li>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handlePrevBtn}
            >
              &lArr;
            </button>
          </li>
          {pageDecreementBtn}
          {showPages}
          {pageIncreementBtn}
          <li>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleNextBtn}
            >
              &rArr;
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default React.memo(Pagination);
