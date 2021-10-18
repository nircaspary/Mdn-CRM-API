import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useFetch } from '../hooks/useFetch';
import { userSchema } from '../models/FormValidations';
import * as Http from '../models/Http';
import auth from '../models/Auth';
import Input from './common/Input';
import Dropdown from './common/Dropdown';
import Location from './Location';
import RenderLoader from './common/RenderLoader';
import 'react-toastify/dist/ReactToastify.css';
import './css/form.css';

const UserProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userSchema) });

  const history = useHistory();
  const [location, setLocation] = useState({});
  const [role, setRole] = useState('');
  const [updateErrors, setUpdateErrors] = useState([]);
  const [pointerEvents, setPointerEvents] = useState('');
  const roles = ['user', 'admin', 'help desk', 'lab', 'info', 'tech'];

  const params = useParams().id;
  let id;
  if (useParams().id === 'my-profile') id = 'me';
  else id = params;
  const { data, serverErrors, isPending } = useFetch(`users/${id}`);
  useEffect(() => {
    if (data.user) {
      setRole(data.user.role);
      setLocation(data.user.location);
    }
  }, [data.user]);

  const onSubmit = async (data) => {
    setPointerEvents('none');
    const { firstName, lastName, email, cellPhone, officePhone, computerName, password, passwordConfirm } = data;
    let user;
    if (role !== 'user' && id !== 'me') user = { firstName, lastName, email, cellPhone, officePhone, computerName, passwordConfirm, password };
    else user = { firstName, lastName, email, cellPhone, officePhone, computerName };

    try {
      const res = await Http.patch(`users/${id}`, { ...user, role, location });
      if (res) {
        toast.success('Your profile has been successfully updated');
        setTimeout(() => history.push('/admins/faults'), 3000);
      }
    } catch (err) {
      setPointerEvents('');
      if (err) setUpdateErrors(err.response.data.message);
    }
  };
  console.log(location);
  return (
    <>
      {isPending && <RenderLoader />}
      <ToastContainer autoClose={3000} />
      {data.user && (
        <form className="ui form profile-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          <h1>{`User ${data.user.id}`}</h1>

          <div className="two fields">
            <Input label="First Name" register={register} defaultValue={data.user.firstName} errors={errors.firstName} />
            <Input label="Last Name" register={register} defaultValue={data.user.lastName} errors={errors.lastName} />
          </div>
          <Input label="Email" register={register} defaultValue={data.user.email} errors={errors.lastName} />
          <div className="two fields">
            <Input label="Cell Phone" register={register} defaultValue={data.user.cellPhone} errors={errors.cellPhone} />
            <Input label="Office Phone" register={register} defaultValue={data.user.officePhone} errors={errors.officePhone} />
          </div>
          <div className="three fields">
            <Location passLocation={(location) => setLocation(location)} userLocation={data.user.location} />
          </div>
          <Input label="Computer Name" register={register} defaultValue={data.user.computerName} errors={errors.computerName} />
          {/* Only if you an admin and the component is "my-profile" you can change role */}
          {auth.user().role === 'admin' && id !== 'me' && (
            <>
              <Dropdown
                label="Role"
                header={data.user.role}
                options={roles.filter((role) => role !== data.user.role)}
                onChange={(e) => setRole(e.target.value)}
              />
              {role && role !== 'user' && (
                <>
                  <Input label="Password" type="password" register={register} errors={errors.password} />
                  <Input label="Password Confirm" type="password" register={register} errors={errors.passwordConfirm} />
                </>
              )}
            </>
          )}
          <div className="field form-element">
            <input type="submit" className="ui button form-element" value="Update Profile" style={{ pointerEvents: pointerEvents }} />

            <button
              type="button"
              className="ui button form-element red"
              onClick={() => history.push(`/admins/users/delete/${id}`)}
              style={{ pointerEvents: pointerEvents }}
            >
              Delete Profile
            </button>
          </div>

          {id === 'me' && (
            <a style={{ textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }} onClick={() => history.push(`change-password`)}>
              Change Password
            </a>
          )}
        </form>
      )}

      {serverErrors && <div>{serverErrors}</div>}
      {updateErrors && <div>{updateErrors}</div>}
    </>
  );
};
export default UserProfile;
