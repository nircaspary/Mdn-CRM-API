import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { filtersContext } from '../contexts/loggedInContexts';
import { removeSpaces } from '../helpers/removeSpaces';
import { addFilter } from '../helpers/addFilter';
import * as Http from '../models/Http';
import Dropdown from './common/Dropdown';
import Input from './common/Input';

import './css/searchFiltering.css';

const SerachFiltering = () => {
  const { filters, setFilters } = useContext(filtersContext);
  const activeFilters = { ...filters };
  const [key, setKey] = useState('id');
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const location = useLocation().pathname.split('/').pop();
  const [response, setResponse] = useState([]);
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const ref = useRef();
  const styles = { width: '100%', display: 'flex', alignItems: 'flex-end' };

  // useEffect for closing autocomplete dropdown on search
  useEffect(() => {
    const onBodyClick = (e) => {
      setOpen(true);
      if (ref.current && ref.current.contains(e.target)) return;
      setOpen(false);
    };

    document.body.addEventListener('click', onBodyClick);
    return () => document.body.removeEventListener('click', onBodyClick);
  }, []);

  // useEffect for search route for both users and faults on search autocomplete dropdown
  useEffect(() => {
    if (!key) return;

    const handler = setTimeout(async () => {
      const { data } = await Http.get(`${location}/search?${removeSpaces(key)}=${value}`);
      if (!value) setResponse([]);
      else setResponse(data.data);
    }, 200);
    return () => clearTimeout(handler);
  }, [key, value]);

  // useEffect for key dropdown options on location changes (faults page or users page)
  useEffect(
    () =>
      location === 'faults'
        ? setOptions(['id', 'subject'])
        : setOptions(['id', 'First name', 'Last name', 'email', 'Computer name', 'Office phone', 'Cellphone', 'Location']),
    [location]
  );

  return (
    <div className="three-fields search" style={styles} ref={ref}>
      <Dropdown options={options} onChange={(e) => setKey(e.target.value)} />

      <Input className="search-input" placeholder="Search..." label="Filter Selection" onChange={(e) => setValue(e.target.value)} />

      <button className="ui button" type="button" onClick={() => addFilter(activeFilters, key, value, setFilters)}>
        Search
      </button>
      {response && open && (
        <div className="results">
          {response.map((res) => {
            const responseId = location === 'faults' ? res._id : res.id;
            return (
              <div className="result" key={res.id} onClick={() => history.push(`${location}/${responseId}`)}>
                <p>
                  <b>Id:</b>
                  {res.id}
                </p>
                <p>
                  <b>{key !== 'id' ? `${key}: ` : res.subject ? 'Subject: ' : 'Name: '}</b>
                  {key !== 'id' ? res[removeSpaces(key)] : res.subject || `${res.firstName} ${res.lastName}`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SerachFiltering;
