import { React, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { faultSchema } from '../models/FormValidations';
import Input from './common/Input';
import Location from './Location';
import RenderLoader from './common/RenderLoader';
import * as Http from '../models/Http';
import 'react-toastify/dist/ReactToastify.css';
import './css/form.css';

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(faultSchema) });
  const [isPending, setIsPending] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [display, setDisplay] = useState(false);
  const [id, setId] = useState('');
  const [location, setLocation] = useState({});
  const [pointerEvents, setPointerEvents] = useState('');

  const onSubmit = async (data) => {
    const { firstName, lastName, email, cellPhone, officePhone, computerName, description, imagesUpload, subject } = data;
    const user = { firstName, lastName, email, cellPhone, officePhone, location, computerName };
    setPointerEvents('none');
    // Send User Data To The Users Collection
    try {
      const userRes = await Http.post(`auth/signup/${id}`, user);
      const fault = new FormData();
      fault.append('subject', subject);
      fault.append('user_id', userRes.data.data.user._id);
      fault.append('description', description);
      for (const e of imagesUpload) fault.append('images', e);
      // Send Fault Data To The Faults Collection
      const faultRes = await Http.post('faults', fault, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (userRes && faultRes) {
        toast.success('U Have Successfully Submited the fault');
        setTimeout(() => setId(''), 3000);
      }
    } catch (err) {
      setPointerEvents('');
      if (err) setServerErrors(err.response.data.message);
    }
  };

  const fillUserData = async (id) => {
    setPointerEvents('');
    setIsPending(true);
    setDisplay(true);
    try {
      const { data } = await Http.get(`users/${id}`);
      // Set Form Values If User Exists
      const { firstName, lastName, email, cellPhone, officePhone, location, computerName } = data.data.user;
      reset({ firstName, lastName, email, cellPhone, officePhone, computerName });
      setLocation(location);
      setTimeout(() => setIsPending(false), 1000);
    } catch (err) {
      reset({ firstName: '', lastName: '', email: '', cellPhone: '', officePhone: '', computerName: '' });
      setLocation({});
      setIsPending(false);
    }
  };

  const clear = () => {
    reset({ firstName: '', lastName: '', email: '', cellPhone: '', officePhone: '', computerName: '' });
    setLocation({});
    setDisplay(false);
  };

  useEffect(() => (id.length === 9 ? fillUserData(id) : clear()), [id]);

  return (
    <form className="ui form fault-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
      <ToastContainer autoClose={3000} />
      <h1>Fill Form</h1>

      <Input label="id" value={id} placeholder="Enter Your ID" onChange={(e) => setId(e.target.value)} />
      {display &&
        (isPending ? (
          <RenderLoader />
        ) : (
          <>
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
              <Location passLocation={(location) => setLocation(location)} userLocation={location} />
            </div>

            <Input label="Computer Name" register={register} errors={errors.computerName} />
            <Input label="Subject" register={register} errors={errors.subject} />
            <Input label="Description" type="textarea" col="50" register={register} errors={errors.description} />
            <Input label="Images Upload" type="file" multiple register={register} />
            <input type="submit" className="ui button form-element" style={{ pointerEvents: pointerEvents }} />
            {serverErrors && <p>{serverErrors}</p>}
          </>
        ))}
    </form>
  );
};

export default Form;
