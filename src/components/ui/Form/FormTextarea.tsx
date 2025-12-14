import React from 'react';
import './Form.scss';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
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
      <textarea className={`form-input form-textarea ${className}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormTextarea;
