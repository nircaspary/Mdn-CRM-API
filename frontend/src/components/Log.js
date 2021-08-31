import React from 'react';
import { formatDateTime } from '../helpers/formatDateTime';
import './css/log.css';

const Log = ({ description, createdAt, team }) => {
  return (
    <div className="log">
      <p>{description}</p>
      <p>{team}</p>
      <p>{formatDateTime(createdAt)}</p>
    </div>
  );
};

export default Log;
