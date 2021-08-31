/* eslint camelcase : 0 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { formatDateTime } from '../helpers/formatDateTime';
import * as Http from '../models/Http';
import Input from './common/Input';
import RenderLoader from './common/RenderLoader';
import Dropdown from './common/Dropdown';
import Log from './Log';
import './css/faultPage.css';

const FaultPage = () => {
  const faultId = useParams().id;
  const [user, setUser] = useState({});
  const [logs, setLogs] = useState([]);
  const [team, setTeam] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [descriptionUpToDate, setDescriptionUpToDate] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [isPending, setIsPending] = useState(true);

  const handleAddLog = async (e) => {
    e.preventDefault();
    const { data } = await Http.post(`faults/${faultId}/faultLogs`, { description, team });
    await Http.patch(`faults/${faultId}`, { team });
    const logsCopy = [...logs];
    logsCopy.push(data.data.faultLog);
    setLogs(logsCopy);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Http.get(`faults/${faultId}`);
        console.log(data.data.fault.images[0]);
        const { description, logs, createdAt, team, user_id, images } = data.data.fault;
        setImages(images);
        setUser(user_id);
        setLogs(logs);
        setTeam(team);
        setDescription(description);
        setCreatedAt(createdAt);
        setIsPending(false);
      } catch (err) {
        console.log(err.response);
      }
    })();
  }, []);
  useEffect(() => logs[logs.length - 1] && setDescriptionUpToDate(logs[logs.length - 1].description), [logs]);

  const role = ['help desk', 'tech', 'lab', 'info'].filter((role) => role !== team);
  return isPending ? (
    <RenderLoader />
  ) : (
    <div className="fault-page-container">
      <div className="fault-details">
        <h2>
          <span>Fault number</span>
          {faultId.substr(faultId.length - 5)}
        </h2>
        <form className="ui form " autoComplete="off" novalidates="true">
          <Input label="Description" type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Description Up To Date" type="textarea" value={descriptionUpToDate} readOnly />
          <Input label="Created At" value={createdAt && formatDateTime(createdAt)} readOnly />
          <Dropdown label="team" options={role} header={team} onChange={(e) => setTeam(e.target.value)} />
          <button className="ui button form-element" type="submit" onClick={handleAddLog}>
            Submit Log
          </button>
        </form>

        <div className="logs-container">
          {logs && logs.map((log) => <Log description={log.description} createdAt={log.createdAt} team={log.team} key={log._id} />).reverse()}
        </div>
      </div>
      <div className="user-details">
        <h2>
          <span>User ID </span>
          {user.id}
        </h2>
        <form className="ui form " autoComplete="off" novalidates="true" style={{ pointerEvents: 'none' }}>
          <div className="two fields">
            <Input label="First Name" defaultValue={user.firstName} />
            <Input label="Last Name" defaultValue={user.lastName} />
          </div>
          <Input label="Building" defaultValue={user.location.building} />
          <Input label="floor" defaultValue={user.location.floor} />
          <Input label="roomNumber" defaultValue={user.location.roomNumber} />
          <Input label="Cell Phone" defaultValue={user.cellPhone} />
          <Input label="Office Phone" defaultValue={user.officePhone} />
          <Input label="Email" defaultValue={user.email} />
          <Input label="role" defaultValue={user.role} />
        </form>
      </div>
    </div>
  );
};
export default FaultPage;
