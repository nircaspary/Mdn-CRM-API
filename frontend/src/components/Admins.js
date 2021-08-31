import { React, useState, useEffect } from 'react';
import { useLocation, Route } from 'react-router-dom';
import { filtersContext } from '../contexts/loggedInContexts';
import Faults from './Faults';
import AddButton from './common/AddButton';
import Users from './Users';
import TableHeader from './common/TableHeader';
import Filter from './Filter';
import TableFooter from './TableFooter';
import './css/admins.css';

const Admins = () => {
  const [filters, setFilters] = useState({});
  const params = useLocation().search;
  const location = useLocation().pathname;

  const faultsFields = ['Fault id', 'Name', 'Email', 'Location', 'Computer Name', 'Subject', 'Team', 'Date Added', 'Completed At', 'Completed'];

  const usersFields = ['User Id', 'Name', 'Email', 'Role', 'Location', 'Team', 'Cell Phone'];

  useEffect(() => setFilters({ page: 1 }), [location]);
  return (
    <filtersContext.Provider value={{ filters, setFilters }}>
      <Filter />
      <AddButton />
      <div className="table-container" style={{ textAlign: 'center', width: '100%' }}>
        <div>
          <Route exact path="/admins/users" render={() => <TableHeader headers={usersFields} />} />
          <Route exact path="/admins/faults" render={() => <TableHeader headers={faultsFields} />} />
        </div>

        <div>
          <Route exact path="/admins/users" render={() => <Users params={params} />} />
          <Route exact path="/admins/faults" render={() => <Faults params={params} />} />
        </div>

        <div className="table-row ui table-footer">
          <Route exact path="/admins/users" render={() => <TableFooter headerLenght={faultsFields.length} />} />
          <Route exact path="/admins/faults" render={() => <TableFooter headerLenght={usersFields.length} />} />
        </div>
      </div>
    </filtersContext.Provider>
  );
};
export default Admins;
