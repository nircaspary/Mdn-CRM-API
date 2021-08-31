import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDateTime } from '../helpers/formatDateTime';
import * as Http from '../models/Http';
import auth from '../models/Auth';
import './css/fault.css';

const Fault = ({ fault: f }) => {
  const [fault, setFault] = useState(f);
  const [expand, setExpand] = useState('');
  const [lastLog, setLastLog] = useState('');
  const history = useHistory();

  let checkboxStyle = { transform: 'scale(1.5)' };
  if (auth.user().role !== 'admin' && fault.isDone === 'Complete') checkboxStyle = { transform: 'scale(1.5)', pointerEvents: 'none' };

  useEffect(() => {
    (async () => {
      try {
        if (expand && !lastLog) {
          const { data } = await Http.get(`faults/${fault._id}/faultLogs`);
          if (data.data.faultLogs[data.data.faultLogs.length - 1]) setLastLog(data.data.faultLogs[data.data.faultLogs.length - 1]);
          else setLastLog('There is no logs to this fault yet');
        }
      } catch (err) {
        console.log(err.response.data.message);
      }
    })();
  }, [expand]);

  const handleChange = async (id, fault) => await Http.patch(`faults/${id}`, fault);

  const handleIsDone = () => {
    const updatedFault = { ...fault };
    if (fault.isDone === 'Complete') {
      updatedFault.isDone = 'Not Complete';
      updatedFault.completed_at = 'Not Complete';
    } else {
      updatedFault.isDone = 'Complete';
      updatedFault.completed_at = formatDateTime(Date.now());
    }
    setFault(updatedFault);
    handleChange(fault._id, updatedFault);
  };

  const handleTeamChange = (e) => {
    const updatedFault = { ...fault, team: e.target.value };
    setFault(updatedFault);
    handleChange(fault._id, updatedFault);
  };

  const expandFault = (e) => {
    if (e.target.type) return;
    if (expand) setExpand('');
    else setExpand('active');
  };

  const roles = ['help desk', 'tech', 'lab', 'info'].filter((role) => role !== fault.team);

  return (
    <div className="ui styled fluid accordion">
      <div
        className={`table-row ui ${expand} ${fault.isDone === 'Complete' && 'green message'}  title`}
        onClick={expandFault}
        onDoubleClick={() => history.push(`/admins/faults/${fault._id}`)}
      >
        <div className="cell">{`${fault.id}`}</div>
        <div className="cell">{`${fault.user_id.firstName} ${fault.user_id.lastName}`}</div>

        <div className="cell">{fault.user_id.email}</div>
        <div className="cell">
          {fault.user_id.location.building}
          <br />
          Floor
          {` ${fault.user_id.location.floor}`}
          <br />
          Room
          {` ${fault.user_id.location.roomNumber}`}
        </div>
        <div className="cell">{fault.user_id.computerName}</div>
        <div className="cell line-description">{fault.subject}</div>
        <div className="cell">
          <select className="ui dropdown" onChange={(e) => handleTeamChange(e)}>
            <option value={fault.team}>{fault.team}</option>
            {roles.map((role) => {
              return (
                <option key={role} value={role}>
                  {role}
                </option>
              );
            })}
          </select>
        </div>
        <div className="cell">{formatDateTime(fault.createdAt)}</div>
        <div className="cell">{fault.completed_at}</div>
        <div className="cell">
          <input type="checkbox" checked={fault.isDone === 'Complete'} onChange={() => handleIsDone()} style={checkboxStyle} />
        </div>
      </div>
      {/* Fault Description And Now */}
      <div className={`table-row ${expand}  content`}>
        <div className="content-container">
          <div className="cell description">
            <h4>Fault Description</h4>
            {fault.description}
            <br />
            <small>{formatDateTime(fault.createdAt)}</small>
          </div>
          <div className="cell description">
            <h4>Fault Description Up to date</h4>
            {lastLog.description || lastLog}
            <br />
            <small>{lastLog.createdAt && formatDateTime(lastLog.createdAt)}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Fault;
