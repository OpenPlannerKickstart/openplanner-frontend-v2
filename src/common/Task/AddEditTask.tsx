import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { addEditTaskAPI } from '../../redux/Service/task';
import { getDate, isNullUndefinedOrBlank, renderError } from '../../Utility/Helper';
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';

type TaskFormValues = {
  id?: number;
  task_name: string;
  due_date: Date | null;
  note: string;
  is_reminder: boolean;
  reminder: Array<{ unit: string; value: string }>;
};

type Props = {
  show: boolean;
  setShow: (open: boolean) => void;
  handleGetData?: () => void;
  editTaskFormData?: any;
  setEditTaskFormData?: (data: any) => void;
};

const DEFAULT_REMINDER = [{ unit: 'days', value: '1' }];

const AddEditTask: React.FC<Props> = ({
  show,
  setShow,
  handleGetData,
  editTaskFormData,
  setEditTaskFormData,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  const initValues: TaskFormValues = useMemo(
    () => ({
      id: undefined,
      task_name: '',
      due_date: null,
      note: '',
      is_reminder: false,
      reminder: [],
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        task_name: yup.string().trim().required('Task name is required'),
        due_date: yup.date().nullable().notRequired(),
        note: yup.string().trim().nullable().notRequired(),
        is_reminder: yup.boolean(),
        reminder: yup.array().notRequired(),
      }),
    []
  );

  const formik: any = useFormik<TaskFormValues>({
    initialValues: initValues,
    validationSchema,
    onSubmit: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (show) {
      setIsMounted(true);
      // Populate for edit
      if (!isNullUndefinedOrBlank(editTaskFormData)) {
        const rawDue = editTaskFormData?.due_date ?? editTaskFormData?.end_date ?? null;
        const due = rawDue ? new Date(rawDue) : null;
        formik.setValues({
          id: editTaskFormData?.id,
          task_name: editTaskFormData?.task_name ?? editTaskFormData?.title ?? '',
          due_date: due && Number.isFinite(due.getTime()) ? due : null,
          note: editTaskFormData?.note ?? '',
          is_reminder: !!editTaskFormData?.is_reminder,
          reminder: Array.isArray(editTaskFormData?.reminder) ? editTaskFormData.reminder : [],
        });
      } else {
        formik.resetForm({ values: initValues });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, editTaskFormData]);

  const close = () => {
    setShow(false);
    // allow close animation to run
    setTimeout(() => {
      setIsMounted(false);
      formik.resetForm({ values: initValues });
      setEditTaskFormData?.(null);
    }, 300);
  };

  const handleClear = () => {
    formik.resetForm({ values: initValues });
  };

  const handleReminderToggle = (next: boolean) => {
    formik.setFieldValue('is_reminder', next);
    if (next) {
      const existing = Array.isArray(formik.values.reminder) ? formik.values.reminder : [];
      if (existing.length === 0) formik.setFieldValue('reminder', DEFAULT_REMINDER);
    } else {
      formik.setFieldValue('reminder', []);
    }
  };

  const handleSave = async () => {
    formik.handleSubmit();
    const errors = await formik.validateForm();
    if (Object.keys(errors || {}).length > 0) {
      formik.setTouched(setNestedObjectValues(errors, true));
      return;
    }

    const noteTrimmed = String(formik.values.note || '').trim();
    const body: any = {
      task_name: String(formik.values.task_name || '').trim(),
      due_date: formik.values.due_date ? getDate(formik.values.due_date) : null,
      // Backend validators reject empty string for note; omit when blank.
      ...(noteTrimmed ? { note: noteTrimmed } : {}),
      is_reminder: !!formik.values.is_reminder,
      reminder: formik.values.is_reminder
        ? (Array.isArray(formik.values.reminder) && formik.values.reminder.length > 0
            ? formik.values.reminder
            : DEFAULT_REMINDER)
        : [],
      ...(formik.values.id ? { task_id: formik.values.id } : {}),
    };

    const resp: any = await dispatch(addEditTaskAPI(body));
    if (!isNullUndefinedOrBlank(resp?.payload)) {
      close();
      handleGetData?.();
    }
  };

  // Avoid rendering modal markup when not in use (prevents flicker)
  if (!show && !isMounted) return null;

  return (
    <Modal
      show={show}
      onHide={close}
      centered
      dialogClassName="add-task-modal"
      className="add-task-modal-wrapper"
      backdrop="static"
    >
      <Modal.Header>
        <h4 className="modal-title">
          Add New <span className="text-primary">Task</span>
        </h4>
        <button type="button" className="modal-close-btn" onClick={close} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </Modal.Header>

      <Modal.Body>
        <div className="form-group">
          <label className="form-label required">Task Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter task name"
            {...formik.getFieldProps('task_name')}
            onBlur={() => formik.setFieldValue('task_name', String(formik.values.task_name || '').trim())}
          />
          {formik.touched.task_name && formik.errors.task_name ? renderError(formik.errors.task_name) : null}
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <div className="date-input-wrapper task-date-wrapper">
            <DatePicker
              selected={formik.values.due_date}
              onChange={(d: Date | null) => formik.setFieldValue('due_date', d)}
              placeholderText="Select Due Date"
              className="form-input"
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              popperClassName="task-date-popper"
              calendarClassName="task-date-calendar"
            />
            <svg className="date-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            className="form-textarea"
            placeholder="Enter note"
            {...formik.getFieldProps('note')}
          />
        </div>

        <div className="form-group reminder-toggle-group">
          <span className="reminder-label">Reminder (Notify me before start date)</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!!formik.values.is_reminder}
              onChange={() => handleReminderToggle(!formik.values.is_reminder)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </Modal.Body>

      <div className="add-event-footer">
        <div className="modal-footer-left">
          <button type="button" className="btn btn-outline" onClick={close}>
            Cancel
          </button>
        </div>
        <div className="modal-footer-right">
          <button type="button" className="btn btn-outline" onClick={handleClear}>
            Clear
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditTask;

