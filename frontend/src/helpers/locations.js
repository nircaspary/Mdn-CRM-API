export const buildings = ['North Building', 'South Building', 'West Building', 'East Building'];

export const floors = (numberOfFloors) => {
  const floors = [];
  for (let i = 0; i < numberOfFloors; i++) floors.push(i);
  return floors;
};

export const roomNumbers = (floor) => {
  const roomNumbers = [];
  for (let i = floor * 100 + 1; i < floor * 100 + 11; i++) roomNumbers.push(i);
  return roomNumbers;
};
