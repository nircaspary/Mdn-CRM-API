import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { passwordSchema } from '../models/FormValidations';
import * as Http from '../models/Http';
import auth from '../models/Auth';
import Input from './common/Input';

const ChangePassword = () => {
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [response, setResponse] = useState('');
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(passwordSchema) });

  const onSubmit = async () => {
    setIsPending(true);
    try {
      const res = await Http.patch('auth/updateMyPassword/', { password, passwordCurrent, passwordConfirm });
      if (res) {
        setIsPending(false);
        alert('You have successfully updated your password');
        auth.logout();
        history.replace('/');
      }
    } catch (err) {
      if (err) {
        setIsPending(false);
        setResponse(err.response.data.message);
      }
    }
  };
  return (
    <form className="ui form fault-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
      {!isPending && (
        <>
          <h1>Change your password</h1>
          <Input
            label="Current Password"
            type="password"
            value={passwordCurrent}
            onChange={(e) => setPasswordCurrent(e.target.value)}
            register={register}
            errors={errors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            register={register}
            errors={errors.newPassword}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            register={register}
            errors={errors.confirmNewPassword}
          />
          <input type="submit" className="ui button form-element" />
        </>
      )}
      <div style={{ textAlign: 'center', fontSize: '25px', color: 'red' }}>
        {isPending && <div>loading...</div>}
        {response && <div>{response}</div>}
      </div>
    </form>
  );
};

export default ChangePassword;
