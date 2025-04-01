import React from 'react'
import { Badge, Button, Col, Dropdown, DropdownButton, Form, InputGroup, Nav, Row, Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import DefaultAvtar from '../../../assets/images/avatar-default.svg'

const PageComponent = (props) => {
    return (
        <>
            <div className="page-content">
                <div className="page-title">
                    <div className="page-title-left">
                        <div className="page-title-text">
                            <h2>Page Component</h2>
                        </div>
                    </div>
                    <div className="page-title-right"></div>
                </div>
                <div className="content-area content-area-title ">
                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Button</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>

                        <Row className=''>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-light-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-light-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-light-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-light-primary btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-outline-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-outline-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-outline-primary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='primary' className='btn-outline-primary btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-light-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-light-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-light-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-light-secondary btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-outline-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-outline-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-outline-secondary btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary' className='btn-outline-secondary btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-light-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-light-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-light-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-light-secondary-two btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='secondary-two' className='btn-outline-secondary btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-light-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-light-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' size='sm' className='btn-light-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-light-success btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-outline-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-outline-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' size='sm' className='btn-outline-success btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='success' className='btn-outline-success btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-light-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-light-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-light-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-light-danger btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-outline-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-outline-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-outline-danger btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='danger' className='btn-outline-danger btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-light-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-light-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-light-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-light-warning btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-outline-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-outline-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-outline-warning btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='warning' className='btn-outline-warning btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-light-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-light-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' size='sm' className='btn-light-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-light-info btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-outline-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-outline-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' size='sm' className='btn-outline-info btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='info' className='btn-outline-info btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                            <Col md={4} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' size='sm' className='btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-light-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-light-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' size='sm' className='btn-light-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-light-white btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-outline-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-outline-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' size='sm' className='btn-outline-white btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                    <Button variant='white' className='btn-outline-white btn-xs btn-icon-text'> <i className='th th-outline-arrow-left-2'></i> Button <i className='th th-outline-arrow-right-3'></i></Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Button Icon</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>

                        <Row>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-icon btn-light-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-light-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-icon btn-light-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-light-primary btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='primary' size='lg' className='btn-icon btn-outline-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-outline-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' size='sm' className='btn-icon btn-outline-primary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='primary' className='btn-icon btn-outline-primary btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-icon btn-light-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-light-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-icon btn-light-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-light-secondary btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary' size='lg' className='btn-icon btn-outline-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-outline-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' size='sm' className='btn-icon btn-outline-secondary btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary' className='btn-icon btn-outline-secondary btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-icon btn-light-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-light-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-icon btn-light-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-light-secondary-two btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='secondary-two' size='lg' className='btn-icon btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' size='sm' className='btn-icon btn-outline-secondary-two btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='secondary-two' className='btn-icon btn-outline-secondary-two btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-icon btn-light-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-light-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' size='sm' className='btn-icon btn-light-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-light-success btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='success' size='lg' className='btn-icon btn-outline-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-outline-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' size='sm' className='btn-icon btn-outline-success btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='success' className='btn-icon btn-outline-success btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-icon btn-light-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-light-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-icon btn-light-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-light-danger btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='danger' size='lg' className='btn-icon btn-outline-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-outline-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' size='sm' className='btn-icon btn-outline-danger btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='danger' className='btn-icon btn-outline-danger btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-icon btn-light-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-light-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-icon btn-light-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-light-warning btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='warning' size='lg' className='btn-icon btn-outline-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-outline-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' size='sm' className='btn-icon btn-outline-warning btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='warning' className='btn-icon btn-outline-warning btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-icon btn-light-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-light-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' size='sm' className='btn-icon btn-light-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-light-info btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='info' size='lg' className='btn-icon btn-outline-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-outline-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' size='sm' className='btn-icon btn-outline-info btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='info' className='btn-icon btn-outline-info btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                            <Col md={3} className='mb-5'>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' size='sm' className='btn-icon btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-icon btn-light-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-light-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' size='sm' className='btn-icon btn-light-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-light-white btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    <Button variant='white' size='lg' className='btn-icon btn-outline-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-outline-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' size='sm' className='btn-icon btn-outline-white btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                    <Button variant='white' className='btn-icon btn-outline-white btn-xs btn-icon-text'> <i className='th th-outline-add-circle'></i></Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Form Control</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Control type="text" placeholder="Placeholder" />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Control size="sm" type="text" placeholder="Placeholder" />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Select size="sm" aria-label="Default select example">
                                        <option>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-start">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control type="text" placeholder="Placeholder" />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-start">
                                        <i className="th th-outline-user"></i>
                                        <Form.Select aria-label="Default select example">
                                            <option>Open this select menu</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-start">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control size="sm" type="text" placeholder="Placeholder" />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-start">
                                        <i className="th th-outline-user"></i>
                                        <Form.Select size="sm" aria-label="Default select example">
                                            <option>Open this select menu</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-end">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control type="text" placeholder="Placeholder" />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-end">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control size="sm" type="text" placeholder="Placeholder" />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="form-group form-success" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Control type="text" placeholder="Placeholder" />
                                    <div className="message success-message"> Looks good! </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-error" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <Form.Control type="text" placeholder="Placeholder" />
                                    <div className="message error-message"> Please provide a valid city.
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-success" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-start">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control type="text" placeholder="Placeholder" />
                                    </div>
                                    <div className="message success-message"> Please provide a valid city.
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-error" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>
                                    <div className="form-group-icon-end">
                                        <i className="th th-outline-user"></i>
                                        <Form.Control type="text" placeholder="Placeholder" />
                                    </div>
                                    <div className="message error-message"> Please provide a valid city.</div>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group " controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>

                                    <div className="form-group-icon-start form-group-password">
                                        <i className="th th-outline-lock"></i>
                                        <Form.Control type="password" placeholder="Placeholder" />
                                        <button className="btn-password">
                                            <i className="th th th-outline-eye"></i></button>
                                    </div>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>

                                    <div className="form-group-icon-start form-group-password">
                                        <i className="th th-outline-lock"></i>
                                        <Form.Control size="sm" type="password" placeholder="Placeholder" />
                                        <button className="btn-password">
                                            <i className="th th th-outline-eye"></i></button>
                                    </div>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group " controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <div className="otp-group">
                                        <Form.Control type="text" />
                                        <Form.Control type="text" />
                                        <Form.Control type="text" />
                                        <Form.Control type="text" />

                                    </div>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <div className="otp-group">
                                        <Form.Control size="sm" type="text" />
                                        <Form.Control size="sm" type="text" />
                                        <Form.Control size="sm" type="text" />
                                        <Form.Control size="sm" type="text" />

                                    </div>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <InputGroup>
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control aria-label="Amount (to the nearest dollar)" />
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <InputGroup className="">
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title="Dropdown"
                                            id="input-group-dropdown-1"
                                        >
                                            <Dropdown.Item href="#">Action</Dropdown.Item>
                                            <Dropdown.Item href="#">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                        </DropdownButton>
                                        <Form.Control aria-label="Text input with dropdown button" />
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <InputGroup size="sm" className="">
                                        <Form.Control
                                            placeholder="Recipient's username"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                        />
                                        <Button size='sm' variant="outline-secondary" id="button-addon2">
                                            Button
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>OTP Group</Form.Label>

                                    <InputGroup size="sm">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control aria-label="Amount (to the nearest dollar)" />
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group " controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input Icon End (Normal)</Form.Label>

                                    <div className="form-group-button">

                                        <div className="form-group-icon-start ">
                                            <i className="th th-outline-lock"></i>
                                            <Form.Control type="password" placeholder="Placeholder" />

                                        </div>
                                        <Button variant='outline-white' ><i className="th th-outline-add-circle text-primary"></i></Button>
                                        <Button variant='outline-white' ><i className="th th-outline-minus-cirlce text-danger"></i></Button>
                                    </div>
                                </Form.Group>

                            </Col>
                            <Col md={3}>
                                <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input Icon End (Normal)</Form.Label>

                                    <div className="form-group-button">

                                        <div className="form-group-icon-start ">
                                            <i className="th th-outline-lock"></i>
                                            <Form.Control size="sm" type="password" placeholder="Placeholder" />

                                        </div>
                                        <Button variant='outline-white' size='sm'><i className="th th-outline-add-circle text-primary"></i></Button>
                                        <Button variant='outline-white' size='sm'><i className="th th-outline-minus-cirlce text-danger"></i></Button>
                                    </div>
                                </Form.Group>

                            </Col>
                        </Row>
                    </div>

                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>File Input</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>


                        <Row>
                            <Col md={4}>
                                <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Form Input (Normal)</Form.Label>

                                    <button className='btn btn-fileupload btn-fileupload-white w-100 mb-3'> <i className="bi bi-upload"></i>
                                        Choose from Browser
                                        <Form.Control type="file" />
                                    </button>
                                    <button className='btn  btn-fileupload btn-primary btn-sm w-100 mb-3'> <i className="bi bi-upload"></i>
                                        Choose from Browser
                                        <Form.Control type="file" />
                                    </button>
                                    <button className='btn  btn-fileupload btn-fileupload-white btn-xs w-100'> <i
                                        className="bi bi-upload"></i>
                                        Choose from Browser
                                        <Form.Control type="file" />
                                    </button>
                                </Form.Group>
                            </Col>
                            <Col md={4}>

                                <Form.Group className="form-group">
                                    <Form.Label>Input Image & File Upload</Form.Label>
                                    <div className='form-control form-group-inner-file-upload'>
                                        <div className='inner-file-upload-left'>
                                            <button className='btn btn-fileupload btn-fileupload-white btn-xs'>Choose from Browser
                                                <Form.Control type="file" />
                                            </button>
                                            <p>Upload Image</p>
                                        </div>
                                        <div className='inner-file-upload-right'>
                                            <p>20kb max</p>
                                        </div>
                                    </div>
                                </Form.Group>
                                <Form.Group className="form-group">
                                    <Form.Label>Input Image & File Upload</Form.Label>
                                    <div className='form-control form-group-inner-file-upload'>
                                        <div className='inner-file-upload-left'>
                                            <button className='btn btn-fileupload btn-primary btn-xs'>Choose from Browser
                                                <Form.Control type="file" />
                                            </button>
                                            <p>Upload Image</p>
                                        </div>
                                        <div className='inner-file-upload-right'>
                                            <p>20kb max</p>
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="form-group">
                                    <Form.Label>Input Image & File Upload</Form.Label>

                                    <div className='attachments-container'>
                                        <div className='attachments-content'>
                                            <button className='btn btn-attachments'><i className="bi bi-upload"></i></button>
                                            <p>Drag and Drop file here or <span className='text-primary'>Choose file</span></p>
                                        </div>
                                        <Form.Control type="file" multiple />
                                    </div>
                                    <div className='attachments-upload-grid-container'>
                                        <div className='attachments-upload-row'>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className='th th-close'></i></button>
                                                </div>
                                            </div>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className='th th-close'></i></button>
                                                </div>
                                            </div>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className='th th-close'></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form.Group>

                            </Col>
                        </Row>


                    </div>
                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Radio</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>

                        <Row>
                            <Col md={4}>
                                <div className="radio radio-primary">
                                    <input type="radio" id="radioGroupOne" name='radioGroup' checked />
                                    <label htmlFor="radioGroupOne">Radio One</label>
                                </div>
                                <div className="radio radio-primary">
                                    <input type="radio" id="radioGroupTwo" name='radioGroup' />
                                    <label htmlFor="radioGroupTwo">Radio Two</label>
                                </div>
                                <div className="radio radio-primary">
                                    <input type="radio" id="radioGroupThree" name='radioGroup' disabled />
                                    <label htmlFor="radioGroupThree">Radio Three</label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="radio radio-primary form-check-inline">
                                    <input type="radio" id="radioGroup2One" name='radioGroup2' checked />
                                    <label htmlFor="radioGroup2One">Radio One</label>
                                </div>
                                <div className="radio radio-primary form-check-inline">
                                    <input type="radio" id="radioGroup2Two" name='radioGroup2' />
                                    <label htmlFor="radioGroup2Two">Radio Two</label>
                                </div>
                                <div className="radio radio-primary form-check-inline">
                                    <input type="radio" id="radioGroup2Three" name='radioGroup2' disabled />
                                    <label htmlFor="radioGroup2Three">Radio Three</label>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Check Box</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>

                        <Row>
                            <Col md={4}>
                                <div className="checkbox checkbox-primary checkbox-small">
                                    <input type="checkbox" id="checkbox" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox"> Check box One </label>
                                </div>
                                <div className="checkbox checkbox-primary checkbox-small">
                                    <input type="checkbox" id="checkbox2" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox2"> Check box Two </label>
                                </div>
                                <div className="checkbox checkbox-primary checkbox-small">
                                    <input type="checkbox" id="checkbox3" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox3"> Check box Three </label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="checkbox11" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox11"> Check box One </label>
                                </div>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="checkbox22" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox22"> Check box Two </label>
                                </div>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="checkbox33" className="material-inputs filled-in" />
                                    <label htmlFor="checkbox33"> Check box Three </label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="w-100 mb-3">
                                    <div className="checkbox checkbox-primary checkbox-small form-check-inline">
                                        <input type="checkbox" id="checkboxTwo" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo"> Check box One </label>
                                    </div>
                                    <div className="checkbox checkbox-primary checkbox-small form-check-inline">
                                        <input type="checkbox" id="checkboxTwo2" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo2"> Check box Two </label>
                                    </div>
                                    <div className="checkbox checkbox-primary checkbox-small form-check-inline">
                                        <input type="checkbox" id="checkboxTwo3" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo3"> Check box Three </label>
                                    </div>
                                </div>
                                <div className="w-100">
                                    <div className="checkbox checkbox-primary form-check-inline">
                                        <input type="checkbox" id="checkboxTwo11" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo11"> Check box One </label>
                                    </div>
                                    <div className="checkbox checkbox-primary form-check-inline">
                                        <input type="checkbox" id="checkboxTwo22" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo22"> Check box Two </label>
                                    </div>
                                    <div className="checkbox checkbox-primary form-check-inline">
                                        <input type="checkbox" id="checkboxTwo33" className="material-inputs filled-in" />
                                        <label htmlFor="checkboxTwo33"> Check box Three </label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Table</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>



                        <div className="table-responsive mb-5">
                            <Table className="table-theme table-bordered">
                                <thead className="border-less">
                                    <tr>
                                        <th className="d-flex align-items-center gap-2">
                                            <div className=" checkbox checkbox-primary checkbox-small">
                                                <input type="checkbox" id="tbl-checkbox" className="material-inputs filled-in" />
                                                <label htmlFor="tbl-checkbox"></label>
                                            </div>
                                            Item Details
                                        </th>

                                        <th>SKU</th>
                                        <th>Carton</th>
                                        <th>Loose Qty</th>
                                        <th>Total Qty</th>
                                        <th>Pur- Breach Qty</th>
                                        <th>Level Qty</th>
                                        <th>Type</th>
                                        <th>Average Price</th>
                                        <th>Sales Price/Piece</th>
                                        <th>Sales Price/Carton</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>

                                        <td className="tbl-user">
                                            <div className="tbl-user-checkbox-srno">
                                                <div className="checkbox checkbox-primary checkbox-small">
                                                    <input type="checkbox" id="tbl-checkbox2" className="material-inputs filled-in" />
                                                    <label htmlFor="tbl-checkbox2"></label>
                                                </div>
                                                <span>01.</span>
                                                <div className="tbl-user-wrapper">
                                                    <div className="tbl-user-image">
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <div className="tbl-user-text-action">
                                                        <div className="tbl-user-text">
                                                            <p>Ink Pen</p>
                                                            <span>SKU #58545854585</span>
                                                        </div>
                                                        <div className="user-action">
                                                            <div className="dropdown">

                                                                <button className="btn-user-action" id="userActionDropDown"
                                                                    data-bs-toggle="dropdown" aria-expanded="false"> <i
                                                                        className="th th-outline-more-circle"></i>
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby="userActionDropDown">
                                                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                                                    <li><a className="dropdown-item" href="#">Something else here</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <button className="btn-user-action"> <i
                                                                className="th th-outline-close-circle"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            VO15252
                                        </td>
                                        <td className="tbl-dropdown">
                                            <div className="dropdown">

                                                <span id="tbl-dropdown " className="btn-link " data-bs-toggle="dropdown"
                                                    aria-expanded="false" data-bs-auto-close="outside">450</span>
                                                <ul className="dropdown-menu" aria-labelledby="tbl-dropdown">
                                                    <div className='nav-tabs-outer nav-tabs-style2'>
                                                        <nav>
                                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                                <button className="nav-link active" id="nav-dropdown-nav-1-tab"
                                                                    data-bs-toggle="tab" data-bs-target="#nav-dropdown-nav-1"
                                                                    type="button" role="tab" aria-controls="nav-dropdown-nav-1"
                                                                    aria-selected="true"> <i className="th th-outline-house-2"></i>
                                                                    Warehouse 1</button>

                                                                <button className="nav-link" id="nav-dropdown-nav-2-tab"
                                                                    data-bs-toggle="tab" data-bs-target="#nav-dropdown-nav-2"
                                                                    type="button" role="tab" aria-controls="nav-dropdown-nav-2"
                                                                    aria-selected="false"><i className="th th-outline-building"></i>
                                                                    Warehouse 2</button>

                                                            </div>
                                                        </nav>
                                                        <div className="tab-content" id="nav-tabContent">
                                                            <div className="tab-pane fade show active" id="nav-dropdown-nav-1"
                                                                role="tabpanel" aria-labelledby="nav-dropdown-nav-1-tab">
                                                                <div className="table-responsive ">
                                                                    <table className="table-theme table table-bordered ">
                                                                        <thead className="border-less">
                                                                            <tr>
                                                                                <th className="">
                                                                                    Marko
                                                                                </th>

                                                                                <th>C x Qty = Total</th>
                                                                                <th>Loose Qty</th>
                                                                                <th>Cartoons</th>
                                                                                <th>Location</th>
                                                                                <th>Carton</th>
                                                                                <th>Loose</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td rowSpan={3} className="tbl-user">
                                                                                    <div className="tbl-user-checkbox-srno">
                                                                                        <div
                                                                                            className="checkbox checkbox-primary checkbox-small">
                                                                                            <input type="checkbox"
                                                                                                id="tbl-checkbox2"
                                                                                                className="material-inputs filled-in" />
                                                                                            <label htmlFor="tbl-checkbox2"></label>
                                                                                        </div>
                                                                                        <div className="tbl-user-wrapper">
                                                                                            <div className="tbl-user-image">
                                                                                                <img src={DefaultAvtar}
                                                                                                    alt="DefaultAvtar" />
                                                                                            </div>
                                                                                            <div className="tbl-user-text">
                                                                                                <p>ZA-50-585-12</p>
                                                                                                <span>Age: 70 Days</span>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td rowSpan={3} >
                                                                                    50 X 20 = 1000
                                                                                </td>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td rowSpan={3} className="tbl-user">
                                                                                    <div className="tbl-user-checkbox-srno">
                                                                                        <div
                                                                                            className="checkbox checkbox-primary checkbox-small">
                                                                                            <input type="checkbox"
                                                                                                id="tbl-checkbox2"
                                                                                                className="material-inputs filled-in" />
                                                                                            <label htmlFor="tbl-checkbox2"></label>
                                                                                        </div>
                                                                                        <div className="tbl-user-wrapper">
                                                                                            <div className="tbl-user-image">
                                                                                                <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                                                            </div>
                                                                                            <div className="tbl-user-text">
                                                                                                <p>ZA-50-585-12</p>
                                                                                                <span>Age: 70 Days</span>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td rowSpan={3} >
                                                                                    50 X 20 = 1000
                                                                                </td>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    10
                                                                                </td>
                                                                                <td>10 x 20 = 200</td>
                                                                                <td>Z11</td>

                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="form-group">
                                                                                        <Form.Control type="text" />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="nav-dropdown-nav-2" role="tabpanel"
                                                                aria-labelledby="nav-dropdown-nav-1-tab">
                                                                Inactive Content Here
                                                            </div>

                                                        </div>

                                                    </div>
                                                </ul>
                                            </div>
                                        </td>
                                        <td>50</td>
                                        <td>5000</td>
                                        <td>20</td>
                                        <td className="tbl-level">
                                            <span>level 1 : 200</span>
                                            <span>level 2 : 300</span>
                                        </td>
                                        <td>Online</td>
                                        <td>₹ 450.00</td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>₹ 450.00</td>
                                        <td className="tbl-action">
                                            <div className="tbl-action-group">
                                                <button className="btn btn-xs btn-light-primary btn-icon"> <i
                                                    className="th th-outline-edit"></i>
                                                </button>
                                                <button className="btn btn-xs btn-light-warning btn-icon"> <i
                                                    className="th th-outline-box-add"></i>
                                                </button>
                                                <button className="btn btn-xs btn-light-danger btn-icon"> <i
                                                    className="th th-outline-trash"></i>
                                                </button>

                                                <div className="dropdown">

                                                    <button className="btn btn-xs btn-light-white btn-icon" id="actionDropDown"
                                                        data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="th th-outline-more"></i>
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="actionDropDown">
                                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="tbl-editable">
                                        <td className="tbl-user">
                                            <div className="tbl-user-checkbox-srno">
                                                <div className="checkbox checkbox-primary checkbox-small">
                                                    <input type="checkbox" id="tbl-checkbox2" className="material-inputs filled-in" />
                                                    <label htmlFor="tbl-checkbox2"></label>
                                                </div>
                                                <span>01.</span>
                                                <div className="tbl-user-wrapper">
                                                    <div className="tbl-user-image">
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <div className="tbl-user-text-action">
                                                        <div className="tbl-user-text">
                                                            <p>Ink Pen</p>
                                                            <span>SKU #58545854585</span>
                                                        </div>
                                                        <div className="user-action">
                                                            <div className="dropdown">

                                                                <button className="btn-user-action" id="userActionDropDown"
                                                                    data-bs-toggle="dropdown" aria-expanded="false"> <i
                                                                        className="th th-outline-more-circle"></i>
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby="userActionDropDown">
                                                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                                                    <li><a className="dropdown-item" href="#">Something else here</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <button className="btn-user-action"> <i
                                                                className="th th-outline-close-circle"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group theme-ngselect">
                                                -
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td className="tbl-level">
                                            <div className="form-group theme-ngselect theme-ngselect-multi">
                                                -
                                            </div>
                                        </td>
                                        <td>

                                            <div className="form-group theme-ngselect">
                                                -
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <Form.Control type="text" />
                                            </div>
                                        </td>
                                        <td className="tbl-action">
                                            <div className="tbl-action-group">

                                                <button className="btn btn-xs btn-light-success btn-icon"> <i
                                                    className="th th-outline-tick-circle"></i>
                                                </button>
                                                <button className="btn btn-xs btn-light-danger btn-icon"> <i
                                                    className="th th-outline-close-circle"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="tbl-add-new">
                                        <td colSpan={100}>
                                            <button className="btn btn-sm btn-link btn-icon-text text-primary"> <i
                                                className="th-bold-add-circle"></i> Add New Row
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </Table>
                        </div>



                    </div>

                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Tabs</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>

                        <div className='nav-tabs-outer nav-tabs-style2'>
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-active-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-active" type="button" role="tab" aria-controls="nav-active"
                                        aria-selected="true"> <i className="th th-outline-tick-circle"></i> Active</button>

                                    <button className="nav-link" id="nav-inactive-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-inactive" type="button" role="tab" aria-controls="nav-inactive"
                                        aria-selected="false"><i className="th th-outline-slash"></i> Inactive</button>

                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-active" role="tabpanel"
                                    aria-labelledby="nav-active-tab">
                                    Active Content Here
                                </div>
                                <div className="tab-pane fade" id="nav-inactive" role="tabpanel" aria-labelledby="nav-inactive-tab">
                                    Inactive Content Here
                                </div>

                            </div>

                        </div>
                        <div className='nav-tabs-outer nav-tabs-style1'>
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-active-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-active" type="button" role="tab" aria-controls="nav-active"
                                        aria-selected="true"> <i className="th th-outline-tick-circle"></i> Active</button>

                                    <button className="nav-link" id="nav-inactive-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-inactive" type="button" role="tab" aria-controls="nav-inactive"
                                        aria-selected="false"><i className="th th-outline-slash"></i> Inactive</button>

                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-active" role="tabpanel"
                                    aria-labelledby="nav-active-tab">
                                    Active Content Here
                                </div>
                                <div className="tab-pane fade" id="nav-inactive" role="tabpanel" aria-labelledby="nav-inactive-tab">
                                    Inactive Content Here
                                </div>

                            </div>

                        </div>
                        <div className='nav-tabs-outer'>
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-active-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-active" type="button" role="tab" aria-controls="nav-active"
                                        aria-selected="true"> <i className="th th-outline-tick-circle"></i> Active</button>

                                    <button className="nav-link" id="nav-inactive-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-inactive" type="button" role="tab" aria-controls="nav-inactive"
                                        aria-selected="false"><i className="th th-outline-slash"></i> Inactive</button>

                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-active" role="tabpanel"
                                    aria-labelledby="nav-active-tab">
                                    Active Content Here
                                </div>
                                <div className="tab-pane fade" id="nav-inactive" role="tabpanel" aria-labelledby="nav-inactive-tab">
                                    Inactive Content Here
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="inner-title">
                            <div className="inner-title-left">
                                <h3>Badge (Status)</h3>
                            </div>
                            <div className="inner-title-right"></div>
                        </div>
                        <Row>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary">primary</Badge>
                                    <Badge bg="secondary">primary</Badge>
                                    <Badge bg="secondary-two">primary</Badge>
                                    <Badge bg="success">primary</Badge>
                                    <Badge bg="danger">primary</Badge>
                                    <Badge bg="warning">primary</Badge>
                                    <Badge bg="info">primary</Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary-light">primary</Badge>
                                    <Badge bg="secondary-light">primary</Badge>
                                    <Badge bg="secondary-two-light">primary</Badge>
                                    <Badge bg="success-light">primary</Badge>
                                    <Badge bg="danger-light">primary</Badge>
                                    <Badge bg="warning-light">primary</Badge>
                                    <Badge bg="info-light">primary</Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary" className='rounded-pill'>primary</Badge>
                                    <Badge bg="secondary" className='rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-two" className='rounded-pill'>primary</Badge>
                                    <Badge bg="success" className='rounded-pill'>primary</Badge>
                                    <Badge bg="danger" className='rounded-pill'>primary</Badge>
                                    <Badge bg="warning" className='rounded-pill'>primary</Badge>
                                    <Badge bg="info" className='rounded-pill'>primary</Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-two-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="success-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="danger-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="warning-light" className='rounded-pill'>primary</Badge>
                                    <Badge bg="info-light" className='rounded-pill'>primary</Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="secondary" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-two" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="success" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="danger" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="warning" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="info" className='badge-sm  rounded-pill'>primary</Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="secondary-two-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="success-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="danger-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="warning-light" className='badge-sm  rounded-pill'>primary</Badge>
                                    <Badge bg="info-light" className='badge-sm  rounded-pill'>primary</Badge>
                                </div>
                            </Col>
                        </Row>
                    </div>











                </div>
            </div>

        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PageComponent)