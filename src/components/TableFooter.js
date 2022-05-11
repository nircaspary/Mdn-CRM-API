import { React, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import { addFilter } from '../helpers/addFilter';
import { filtersContext } from '../contexts/loggedInContexts';
import { pagesContext } from '../contexts/pagesContext';
import './css/admins.css';

const TableFooter = ({ headerLenght }) => {
  const [activePage, setActivePage] = useState(1);
  const { filters, setFilters } = useContext(filtersContext);
  const { pages } = useContext(pagesContext);
  const activeFilters = { ...filters };

  // Debounce page click for saving server calls
  useEffect(() => {
    const handler = setTimeout(() => addFilter(activeFilters, 'page', activePage, setFilters), 200);
    return () => clearTimeout(handler);
  }, [activePage]);

  const pageNumbers = [];
  for (let i = 1; i < pages + 1; i += 1) pageNumbers.push(i);

  const handlePageNumberClick = (page) => setActivePage(page);
  const handleNextPageClick = (page) => page !== pageNumbers.length && setActivePage(page + 1);
  const handlePreviousPageClick = (page) => page !== 1 && setActivePage(page - 1);

  return (
    pages > 1 && (
      <div colSpan={headerLenght}>
        <div className="ui pagination menu">
          <a className="icon item" onClick={() => handlePreviousPageClick(activePage)}>
            <i className="left chevron icon" />
          </a>
          {pageNumbers.map((page) => {
            const active = page === activePage ? 'active' : '';
            return (
              <a onClick={() => handlePageNumberClick(page)} className={`item ${active}`} key={page}>
                {page}
              </a>
            );
          })}
          <a className="icon item" onClick={() => handleNextPageClick(activePage)}>
            <i className="right chevron icon" />
          </a>
        </div>
      </div>
    )
  );
};
export default TableFooter;
