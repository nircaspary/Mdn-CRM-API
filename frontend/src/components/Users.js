import { React } from 'react';
import User from './User';
import { useFetch } from '../hooks/useFetch';

import RenderLoader from './common/RenderLoader';
import './css/admins.css';

const Users = ({ params }) => {
  const { data, errors, isPending } = useFetch(`users${params}`);

  return (
    <>
      {isPending && <RenderLoader />}
      {data.users && data.users.map((user) => <User user={user} key={user._id} />)}
      {errors && <p>{errors}</p>}
    </>
  );
};
export default Users;
