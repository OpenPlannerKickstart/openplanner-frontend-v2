import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import * as yup from 'yup';

type Props = {
  show: boolean;
  setShow: (v: boolean) => void;
  onSave?: (payload: { title: string; due_date: Date | null; note: string; is_reminder: boolean }) => Promise<void> | void;
};

const AddEditTask: React.FC<Props> = ({ show, setShow, onSave }) => {
  const [internalShow, setInternalShow] = useState(false);

  const handleClose = () => {
    setInternalShow(false);
    setShow(false);
    setTimeout(() => {
      formik.resetForm();
    }, 250);
  };

  useEffect(() => {
    if (show) {
      setInternalShow(true);
      formik.resetForm();
    } else {
      setInternalShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const validationSchema = yup.object({
    title: yup.string().trim().required('Task name is required'),
    due_date: yup.date().nullable().notRequired(),
    note: yup.string().notRequired(),
    is_reminder: yup.boolean().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      due_date: null as Date | null,
      note: '',
      is_reminder: false,
    },
    validationSchema,
    onSubmit: () => {},
    enableReinitialize: true,
  });

  const handleClear = () => formik.resetForm();

  const handleSave = async () => {
    formik.handleSubmit();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ title: true, due_date: true, note: true, is_reminder: true } as any);
      return;
    }
    const payload = {
      title: formik.values.title.trim(),
      due_date: formik.values.due_date,
      note: formik.values.note || '',
      is_reminder: !!formik.values.is_reminder,
    };
    await onSave?.(payload);
    handleClose();
  };

  return (
    <Modal
      show={internalShow}
      onHide={handleClose}
      centered
      className="add-task-modal-wrapper"
      dialogClassName="add-task-modal"
      keyboard
    >
      <div className="modal-header">
        <h2 className="modal-title">
          Add New <span className="text-primary">Task</span>
        </h2>
        <button className="modal-close-btn" type="button" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label className="form-label required">Task Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter task name"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title ? (
            <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{String(formik.errors.title)}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <div className="date-input-wrapper">
            <DatePicker
              selected={formik.values.due_date}
              onChange={(d) => formik.setFieldValue('due_date', d)}
              placeholderText="Select Due Date"
              className="form-input"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeSelect
              timeCaption="Time"
              timeIntervals={30}
              popperProps={{ strategy: 'fixed' }}
              popperPlacement="bottom-start"
              popperClassName="task-date-popper"
              calendarClassName="task-date-calendar"
              wrapperClassName="task-date-wrapper"
              showPopperArrow={false}
            />
            <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Enter note"
            rows={4}
            {...formik.getFieldProps('note')}
          />
        </div>

        <div className="reminder-toggle-group">
          <span className="reminder-label">Reminder (Notify me before start date)</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formik.values.is_reminder}
              onChange={(e) => formik.setFieldValue('is_reminder', e.currentTarget.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="modal-footer add-event-footer">
        <button className="btn btn-outline" type="button" onClick={handleClose}>
          Cancel
        </button>
        <div className="modal-footer-right">
          <button className="btn btn-outline" type="button" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditTask;


