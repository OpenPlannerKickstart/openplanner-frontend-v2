import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'

const DeleteAccount = () => {
  return (
    <>
        <div className="profile-main-wrapper">
            <Card>
                <Card.Body>
                    <div className="setting-main-title">
                        <h2>Delete Account</h2>
                        <p>We're sorry to see you go...</p>
                    </div>
                    <div className="main-form-wrapper">
                        <Form.Group className='form-group'>
                            <Form.Label>Reason</Form.Label>
                            <Form.Control as="textarea"  placeholder="Enter reason to delete account" rows={3} />
                        </Form.Group>
                        <Form.Group className='form-group '>
                            <Form.Label>Password</Form.Label>
                            <div className="form-group form-group-password">
                                <Form.Control type="password" placeholder='Enter password'
                                />
                                <button className='btn-password'> 
                                <i className="material-symbols-outlined">visibility</i>
                                </button>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="button-group">
                        <Button variant="danger" className="btn-icon-text">
                            <i className="material-symbols-outlined">delete</i> Delete Account
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

export default DeleteAccount