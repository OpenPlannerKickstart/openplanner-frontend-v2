import React from 'react';
import './Form.scss';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: Array<{ value: string | number; label: string }>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  icon,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {icon && icon}
          {label}
        </label>
      )}
      <div className="form-select-wrapper">
        <select className={`form-input form-select ${className}`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="select-arrow"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormSelect;
