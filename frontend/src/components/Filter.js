import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { serializeUrl } from '../helpers/serializeUrl';
import { addFilter } from '../helpers/addFilter';
import { filtersContext } from '../contexts/loggedInContexts';
import Dropdown from './common/Dropdown';
import auth from '../models/Auth';
import Tag from './common/Tag';
import SerachFiltering from './SearchFiltering';

import './css/admins.css';

const Filter = () => {
  const { filters, setFilters } = useContext(filtersContext);
  const activeFilters = { ...filters };
  const history = useHistory();
  const params = serializeUrl(filters);
  const location = useLocation().pathname.split('/').pop();

  useEffect(() => history.push(`?${params}`), [filters]);
  const dropdownLabel = location === 'faults' ? 'Team' : 'Role';
  const dropdownOptions = location === 'faults' ? ['help desk', 'info', 'lab', 'tech'] : ['user', 'admin', 'help desk', 'info', 'lab', 'tech'];

  return (
    <div className="ui form" style={{ width: '90%', paddingTop: '10px' }}>
      <div className="three fields">
        {auth.user().role === 'admin' && (
          <Dropdown
            label={dropdownLabel}
            options={dropdownOptions}
            header={`Select ${dropdownLabel}`}
            onChange={(e) => addFilter(activeFilters, dropdownLabel, e.target.value, setFilters)}
          />
        )}
        <SerachFiltering />
        {location === 'faults' && (
          <Dropdown
            label="status"
            options={['Complete', 'Not Complete']}
            header="Select Status"
            onChange={(e) => addFilter(activeFilters, 'is Done', e.target.value, setFilters)}
          />
        )}
      </div>

      <div className="tags-container" style={{ paddingTop: '10px' }}>
        {params.split('&').map((filter) => {
          if (filter.includes('page')) return;
          return <Tag key={`Filter ${filter}`} filter={filter} />;
        })}
      </div>
    </div>
  );
};
export default Filter;
