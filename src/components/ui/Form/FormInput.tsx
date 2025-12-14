import React from 'react';
import './Form.scss';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  icon,
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
      <input className={`form-input ${className}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput;
