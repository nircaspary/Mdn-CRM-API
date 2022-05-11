import React from 'react';
const Dropdown = ({ options, label, errors, register, ...rest }, ref) => {
  return (
    <div className="field">
      <label>{label}</label>
      <select {...rest}>
        {rest.header && <option value="">{rest.header}</option>}
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Dropdown;
