import React from 'react';

const TableHeader = ({ headers }) => {
  return (
    <div className="ui table-row">
      {headers
        ? headers.map((header) => {
            return (
              <div className="cell" key={header}>
                {header}
              </div>
            );
          })
        : null}
    </div>
  );
};
export default TableHeader;
