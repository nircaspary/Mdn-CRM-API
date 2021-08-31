import React from 'react';
import { useHistory } from 'react-router';

const ForgotPasswordRes = () => {
  const history = useHistory();
  const styles = {
    height: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
  };
  return (
    <div>
      <div style={styles}>Reset password email has been sent to your mail inbox</div>
      <a onClick={() => history.replace('/')}>Back to home page</a>
    </div>
  );
};
export default ForgotPasswordRes;
