import { React, useState } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { userSchema } from '../models/FormValidations';
import * as Http from '../models/Http';
import Location from './Location';
import Input from './common/Input';
import Dropdown from './common/Dropdown';
import 'react-toastify/dist/ReactToastify.css';
import './css/form.css';

const CreateUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userSchema) });
  const history = useHistory();

  const [serverErrors, setServerErrors] = useState('');
  const [role, setRole] = useState('user');
  const [location, setLocation] = useState({});
  const [pointerEvents, setPointerEvents] = useState('');

  const onSubmit = async (data) => {
    setPointerEvents('none');
    const { firstName, lastName, email, cellPhone, officePhone, computerName, id, password, passwordConfirm } = data;
    const user = { firstName, lastName, email, cellPhone, officePhone, location, computerName, id, role, password, passwordConfirm };
    // Send User Data To The Users Collection
    try {
      const userRes = await Http.post('users', user);
      toast.success('U Have Successfully Created User');
      setTimeout(() => history.push('/admins/users'), 3000);
    } catch (err) {
      if (err) setServerErrors(err.response.data.message);
    }
  };

  return (
    <form className="ui form fault-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
      <ToastContainer autoClose={3000} />
      <h1>Create User</h1>
      <Input label="id" register={register} errors={errors.id} />
      <div className="two fields">
        <Input label="First Name" register={register} errors={errors.firstName} />
        <Input label="Last Name" register={register} errors={errors.lastName} />
      </div>
      <Input label="Email" register={register} errors={errors.email} />
      <div className="two fields">
        <Input label="Cell Phone" register={register} errors={errors.cellPhone} />
        <Input label="Office Phone" register={register} errors={errors.officePhone} />
      </div>
      <div className="three fields">
        <Location passLocation={(loc) => setLocation(loc)} userLocation={location} />
      </div>
      <Input label="Computer Name" register={register} errors={errors.computerName} />

      <Dropdown label="Role" options={['user', 'admin', 'help desk', 'tech', 'lab', 'info']} onChange={(e) => setRole(e.target.value)} />
      {role && role !== 'user' && (
        <>
          <Input label="Password" type="password" register={register} errors={errors.password} />
          <Input label="Password Confirm" type="password" register={register} errors={errors.passwordConfirm} />
        </>
      )}

      <input type="submit" className="ui button form-element" value="Create User" style={{ pointerEvents: pointerEvents }} />
      {serverErrors && <p>{serverErrors}</p>}
    </form>
  );
};

export default CreateUser;
