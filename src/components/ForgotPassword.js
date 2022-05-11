import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from './common/Input';
import * as Http from '../models/Http';
import RenderLoader from './common/RenderLoader';
import { emailSchema } from '../models/FormValidations';

const ForgotPassword = () => {
  const [serverErrors, setServerErrors] = useState('');
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(emailSchema) });

  const onSubmit = async ({ email }) => {
    setIsPending(true);
    try {
      const res = await Http.post('auth/forgotPassword', { email });
      if (res) {
        setIsPending(false);
        history.replace('/login/forgot-password-sent');
      }
    } catch (err) {
      if (err) {
        setIsPending(false);
        setServerErrors(err.response.data.message);
      }
    }
  };

  return (
    <>
      {isPending ? (
        <RenderLoader />
      ) : (
        <form className="ui form login-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
          <h1>Forgot your password?</h1>
          <p style={{ textAlign: 'center' }}>please enter your email address for validation</p>
          <Input placeholder="ex: user@gmail.com" register={register} label="email" errors={errors.email} />
          <input type="submit" value="Get verification code" className="ui button form-element" />
          {serverErrors && <p style={{ color: 'red' }}>{serverErrors}</p>}
        </form>
      )}
    </>
  );
};

export default ForgotPassword;
