import React, { useState, useEffect } from 'react';
import Dropdown from './common/Dropdown';
import { buildings, floors, roomNumbers } from '../helpers/locations';

const Location = ({ passLocation, userLocation }) => {
  const [building, setBuilding] = useState(userLocation.building || 'North Building');
  const [floor, setFloor] = useState(userLocation.floor || 0);
  const [roomNumber, setRoomNumber] = useState(userLocation.roomNumber || 1);

  useEffect(() => passLocation({ building, floor, roomNumber }), [building, floor, roomNumber]);

  return (
    <>
      <div className="field form-element">
        <Dropdown label="Building" options={buildings} onChange={(e) => setBuilding(e.target.value)} />
      </div>
      <div className="field form-element">
        <Dropdown label="Floor" options={floors(8)} header={floor} onChange={(e) => setFloor(e.target.value)} />
      </div>
      <div className="field form-element">
        <Dropdown label="Room Number" options={roomNumbers(floor)} header={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
      </div>
    </>
  );
};
export default Location;
