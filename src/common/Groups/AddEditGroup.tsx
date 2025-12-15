import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as yup from 'yup'
import { useFormik } from 'formik'
import GroupAvatar from '../../components/GroupAvatar/GroupAvatar'
import { isEmptyObjectOrNullUndefiend, renderError } from '../../Utility/Helper'

type AddEditGroupProps = {
  showGroup: boolean,
  setShowGroup: (v: boolean) => void,
  handleGetData?: () => void,
  onCreate?: (payload: { type: 'subgroup'; name: string; description: string | null; privacy: 'public' | 'invite_only'; avatarColor: string | null; }) => Promise<void> | void,
}

const AddEditGroup: React.FC<AddEditGroupProps> = (props) => {
  const handleClose = () => {
    props.setShowGroup(false)
    setTimeout(() => {
      formik.resetForm()
    }, 300)
  }

  useEffect(() => {
    if (props.showGroup) {
      formik.resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showGroup])

  const validationSchema = yup.object({
    name: yup.string().trim().required('Group name is required'),
    description: yup.string().trim().notRequired(),
    isPublic: yup.boolean().notRequired(),
  })

  const formik = useFormik({
    initialValues: { name: '', description: '', isPublic: false, color: '#239BC2' },
    validationSchema,
    onSubmit: () => {},
    enableReinitialize: true,
  })

  const handleSave = async () => {
    formik.handleSubmit()
    const errors = await formik.validateForm()
    if (!isEmptyObjectOrNullUndefiend(errors)) {
      return
    }
    const payload = {
      type: 'subgroup' as const,
      name: formik.values.name.trim(),
      description: formik.values.description ? formik.values.description : null,
      privacy: (formik.values.isPublic ? 'public' : 'invite_only') as 'public' | 'invite_only',
      avatarColor: formik.values.color || null,
    }
    if (props.onCreate) {
      await props.onCreate(payload)
    }
    handleClose()
    props.handleGetData && props.handleGetData()
  }

  const handleClear = () => {
    formik.resetForm()
  }

  const colorPalette = [
    '#239BC2', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
    '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'
  ]

  return (
    <>
      <Modal
        className="add-group-modal"
        show={props.showGroup}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard
        dialogClassName="group-modal"
      >
        <Modal.Header>
          <Modal.Title>
            Create <span className="title-accent">Group</span>
          </Modal.Title>
          <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label className="form-label">
              Group Name <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              className="form-input"
              placeholder="Enter group name"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name ? renderError(formik.errors.name) : null}
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              className="form-textarea"
              placeholder="Add a short description"
              {...formik.getFieldProps('description')}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">Group Color</Form.Label>
            <div className="group-color-row">
              <div className="group-color-preview">
                <GroupAvatar color={formik.values.color} size={44} />
                <div className="group-color-value">{formik.values.color}</div>
              </div>
              <div className="color-picker-container">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-option${formik.values.color === c ? ' selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => formik.setFieldValue('color', c)}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>
          </Form.Group>
        </Modal.Body>

        <div className="modal-footer group-footer">
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
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
    </>
  )
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditGroup)


