import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../models/FormValidations';
import auth from '../models/Auth';
import Input from './common/Input';
import RenderLoader from './common/RenderLoader';
import './css/form.css';

const AdminLogin = (props) => {
  const [serverErrors, setServerErrors] = useState('');
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      await auth.login(data.id, data.password);
      setTimeout(() => window.location.replace('/admins/faults'), 1000);
    } catch (err) {
      if (err.response.data.message) {
        setServerErrors(err.response.data.message);
        setIsPending(false);
      }
    }
  };

  return (
    <form className="ui form login-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
      <h1>Admins Login</h1>
      <Input label="id" register={register} errors={errors.id} />
      <Input label="Password" type="password" register={register} errors={errors.password} />
      <input value="login" className="ui button form-element" type="submit" />
      {isPending ? <RenderLoader size="100" /> : <p style={{ textAlign: 'center', color: 'red', fontSize: '20px' }}>{serverErrors}</p>}
      <a style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => props.history.replace('/login/forgot-password')}>
        Forgot your password?
      </a>
    </form>
  );
};
export default AdminLogin;
