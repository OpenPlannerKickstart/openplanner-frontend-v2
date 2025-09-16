import React, { useEffect, useState } from 'react'
import { Button, Form, Offcanvas, Overlay, Popover } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as yup from 'yup'
import { useFormik } from 'formik'
import GroupAvatar from '../../components/GroupAvatar/GroupAvatar'
import { isEmptyObjectOrNullUndefiend, renderError } from '../../Utility/Helper'

type AddEditGroupProps = {
  showGroup: boolean,
  setShowGroup: (v: boolean) => void,
  handleGetData?: () => void,
}

const AddEditGroup: React.FC<AddEditGroupProps> = (props) => {
  const [visible, setVisible] = useState(false)

  const handleClose = () => {
    setVisible(false)
    props.setShowGroup(false)
    setTimeout(() => {
      formik.resetForm()
    }, 300)
  }
  const handleShow = () => setVisible(true)

  useEffect(() => {
    if (props.showGroup) {
      handleShow()
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
    // No API wiring yet; close and optionally notify parent for refresh
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

  const [showColorPopover, setShowColorPopover] = useState(false)
  const [popoverTarget, setPopoverTarget] = useState<any>(null)

  return (
    <>
      <div className="add-syllabus-event-wrapper">
        <Offcanvas
          className="edit-course-canvas add-syllabus-event"
          show={visible}
          placement={"end"}
          onHide={handleClose}
        >
          <Offcanvas.Header>
            <Offcanvas.Title>
              Create <span>Group</span>
            </Offcanvas.Title>
            <button type="button" className="btn-close" onClick={handleClose}>
              <i className='material-symbols-outlined'>close</i>
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="add-syllabus-container">
              <div className="main-syllabus-container">
                <div className="syllabus-details-container">
                  <div className="Add-new-task-container op-offcanvas-body-container">
                    <div className="syllabus-detail-body">
                <Form.Group className="form-group required">
                  <Form.Label>Group Name</Form.Label>
                  <div className="form-group-icon-start">
                    <i className="material-symbols-outlined">groups</i>
                    <Form.Control
                      type="text"
                      placeholder="Enter group name"
                      {...formik.getFieldProps('name')}
                    />
                  </div>
                  {formik.touched.name && formik.errors.name ? renderError(formik.errors.name) : null}
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Description (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add a short description"
                    {...formik.getFieldProps('description')}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check
                      type="checkbox"
                      id="group-public"
                      checked={formik.values.isPublic}
                      onChange={(e) => formik.setFieldValue('isPublic', e.currentTarget.checked)}
                      label="Public group"
                    />
                  </div>
                </Form.Group>

                {/* Color picker + live preview */}
                <Form.Group className="form-group">
                  <Form.Label>Group Color</Form.Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <GroupAvatar color={formik.values.color} size={56} />
                    <button
                      type="button"
                      title={formik.values.color}
                      aria-label="Selected color"
                      onClick={(e) => { setPopoverTarget(e.currentTarget); setShowColorPopover(true); }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: formik.values.color,
                        border: '2px solid #ccc',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formik.values.color}
                      readOnly
                      onClick={(e) => { setPopoverTarget(e.currentTarget); setShowColorPopover(true); }}
                      style={{ maxWidth: 140 }}
                    />
                  </div>
                  <Overlay
                    show={showColorPopover}
                    target={popoverTarget}
                    placement="top"
                    containerPadding={12}
                    rootClose
                    onHide={() => setShowColorPopover(false)}
                  >
                    <Popover id="group-color-popover">
                      <Popover.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 28px)', gap: 8 }}>
                          {colorPalette.map((c) => (
                            <span
                              key={c}
                              onClick={() => { formik.setFieldValue('color', c); setShowColorPopover(false); }}
                              title={c}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: c,
                                border: '1px solid #E5E7EB',
                                cursor: 'pointer'
                              }}
                            />
                          ))}
                        </div>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </Form.Group>
                    </div>
                  </div>

                  <div className="bottom-button-group">
                  <Button type="button" className="btn btn-light-white me-auto" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="button" className="btn btn-light-white" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditGroup)


