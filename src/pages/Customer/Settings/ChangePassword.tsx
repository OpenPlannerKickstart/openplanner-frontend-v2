import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'

const ChangePassword = () => {
  return (
    <>
        <div className="profile-main-wrapper">
            <Card>
                <Card.Body>
                    <div className="setting-main-title">
                        <h2>Change Password</h2>
                    </div>
                    <div className="main-form-wrapper">
                        <Form.Group className='form-group'>
                            <Form.Label>Current Password</Form.Label>
                            <div className="form-group-icon-start form-group-password">
                                <i className="material-symbols-outlined">lock</i>
                                <Form.Control type="password" placeholder='Enter current password'
                                />
                                <button className='btn-password'> 
                                <i className="material-symbols-outlined">visibility</i>
                                </button>
                            </div>
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label>New Password</Form.Label>
                            <div className="form-group-icon-start form-group-password">
                                <i className="material-symbols-outlined">lock</i>
                                <Form.Control type="password" placeholder='Enter new password'
                                />
                                <button className='btn-password'> 
                                <i className="material-symbols-outlined">visibility</i>
                                </button>
                            </div>
                        </Form.Group>
                        <Form.Group className='form-group '>
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="form-group-icon-start form-group-password">
                                <i className="material-symbols-outlined">lock</i>
                                <Form.Control type="password" placeholder='Re-enter new password'
                                />
                                <button className='btn-password'> 
                                <i className="material-symbols-outlined">visibility</i>
                                </button>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="button-group">
                        <Button variant="primary" className="btn-icon-text">
                            <i className="material-symbols-outlined">key</i> Change Password
                        </Button>
                        <Button variant="outline-white">
                            Cancel
                        </Button>
                    </div> 
                </Card.Body>
            </Card>
        </div>    
    </>
  )
}

export default ChangePassword