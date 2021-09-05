import React from 'react';
import { useHistory } from 'react-router';

const ForgotPasswordRes = () => {
  const history = useHistory();
  const styles = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={styles}>
      <h1>Reset password email has been sent to your mail inbox</h1>
      <a onClick={() => history.replace('/')} style={{ cursor: 'pointer' }}>
        Back to home page
      </a>
    </div>
  );
};
export default ForgotPasswordRes;
