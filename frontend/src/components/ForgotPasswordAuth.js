import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { forgotPasswordSchema } from '../models/FormValidations';
import Input from './common/Input';
import * as Http from '../models/Http';
import RenderLoader from './common/RenderLoader';

const ForgotPasswordAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

  const authToken = useParams().id;
  const history = useHistory();
  const [serverErrors, setServerErrors] = useState('');
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data) => {
    setIsPending(true);
    const { password, passwordConfirm } = data;
    try {
      const res = await Http.patch(`auth/resetPassword/${authToken}`, { password, passwordConfirm });
      if (res) {
        toast.success('U Have Successfully changed your password');
        setTimeout(() => history.replace('/'), 3000);
      }
    } catch (err) {
      if (err.response.data.message) {
        setServerErrors(err.response.data.message);
        setIsPending(false);
      }
    }
  };
  return (
    <>
      <ToastContainer autoClose={3000} />
      {isPending ? (
        <RenderLoader />
      ) : (
        <form className="ui form login-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
          <h1>Forgot your password?</h1>
          <Input type="password" label="Password" register={register} errors={errors.password} />
          <Input type="password" label="Password Confirm" register={register} errors={errors.passwordConfirm} />
          <Input type="submit" value="Set New Password" className="ui button form-element" />
          {serverErrors && <p>{serverErrors}</p>}
        </form>
      )}
    </>
  );
};

export default ForgotPasswordAuth;
