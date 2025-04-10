import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import UserProfile from "/assets/images/setting-profile.svg";

const MyProfile = () => {
  return (
    <>
        <div className="profile-main-wrapper">
            <Card>
                <Card.Body>
                    <div className="setting-main-title">
                        <h2>My Profile</h2>
                    </div>
                    <div className="profile-upload">
                        <div className="profile-image">
                            <img src={UserProfile} alt="OpenPlaner"/>
                        </div>
                        <div className="profile-text">
                            <h6>Wong Hashitoma</h6>
                            <div className="button-group">
                                <Button className="btn btn-white btn-fileupload btn-outline-white btn-sm">
                                    <i className="bi bi-upload"></i> Change
                                    <input type="file" accept="image/x-png,image/jpeg,image/jpg"/>
                                </Button>
                                <Button className="btn btn-white btn-fileupload btn-outline-white btn-sm">
                                    <i className="material-symbols-outlined">delete</i>Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="main-form-wrapper">
                        <Row>
                            <Col md={6}>
                                <Form.Group
                                    className="form-group"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>First Name</Form.Label>
                                    <div className="form-group">
                                        <Form.Control type="text" placeholder="Clair" />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="form-group"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>Last Name</Form.Label>
                                    <div className="form-group">
                                        <Form.Control type="text" placeholder="Wilson" />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="form-group">
                            <Form.Label>Email Address</Form.Label>
                            <div className="form-group">
                            <Form.Control type="email" placeholder="wonghashitoma545@gmail.com"
                            />
                            </div>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>University Name</Form.Label>
                            <div className="form-group">
                                <Form.Control
                                    type="text"
                                    placeholder="Greenwood University"
                                />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="button-group">
                        <Button variant="primary" className="btn-icon-text">
                            <i className="material-symbols-outlined">person</i> Update Profile
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

export default MyProfile