import { React } from 'react';
import { useFetch } from '../hooks/useFetch';
import Fault from './Fault';
import RenderLoader from './common/RenderLoader';

const Faults = ({ params }) => {
  const { data, errors, isPending } = useFetch(`faults${params}`);

  return (
    <>
      {isPending && <RenderLoader />}
      {data.faults && data.faults.map((fault) => <Fault fault={fault} key={fault._id} />)}
      {errors && <p>{errors}</p>}
    </>
  );
};
export default Faults;
