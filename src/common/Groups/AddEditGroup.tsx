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

  const getGroupColorName = (hex?: string) => {
    if (!hex || typeof hex !== 'string') return ''
    const map: Record<string, string> = {
      '#239bc2': 'Cyan',
      '#f97316': 'Orange',
      '#eab308': 'Yellow',
      '#22c55e': 'Green',
      '#14b8a6': 'Teal',
      '#d97706': 'Gold',
      '#3b82f6': 'Blue',
      '#cddc39': 'Lime',
      '#ef4444': 'Red',
      '#8b5cf6': 'Purple',
      '#ec4899': 'Pink',
      '#6b7280': 'Gray',
      '#78716c': 'Stone',
      '#6366f1': 'Indigo',
    }
    return map[hex.toLowerCase()] || hex
  }

  // Match Add Syllabus modal (new design system palette)
  const colorPalette = [
    '#239BC2', // Cyan (default)
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#14B8A6', // Teal
    '#D97706', // Gold
    '#3B82F6', // Blue
    '#cddc39', // Lime
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#78716C', // Stone
    '#6366F1', // Indigo
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
                <div className="group-color-value">{getGroupColorName(formik.values.color)}</div>
              </div>
              <div className="color-picker-container">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-option${formik.values.color === c ? ' selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => formik.setFieldValue('color', c)}
                    aria-label={`Select color ${getGroupColorName(c)}`}
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


