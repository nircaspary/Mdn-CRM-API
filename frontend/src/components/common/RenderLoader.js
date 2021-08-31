import React from 'react';
import Loader from 'react-loader-spinner';

const RenderLoader = ({ size = 250 }) => {
  const style = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={style}>
      <Loader type="Puff" color="#00BFFF" height={size} width={size} />
    </div>
  );
};

export default RenderLoader;
