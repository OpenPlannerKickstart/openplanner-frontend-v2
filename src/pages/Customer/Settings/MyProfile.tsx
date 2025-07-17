import React, { useEffect, useRef } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import UserProfile from "/assets/images/setting-profile.svg";
import { customJsonInclude, FILE_SIZE, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError, SUPPORTED_FORMATS } from '../../../Utility/Helper';
import { setNestedObjectValues } from 'formik';
import { updateUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { AppDispatch } from '../../../redux/store';
import { connect, useDispatch } from 'react-redux';
import { MAX_50, ONLY_ALPHABETS_AND_DOT } from '../../../Utility/Validation_Helper';
import { EMAIL_REQUIRED, ENTER_VALID_FIRSTNAME, ENTER_VALID_LASTNAME, ENTER_VALID_UNIVERSITY, FIRST_NAME_REQUIRED, LAST_NAME_REQUIRED, UNIVERSITY_NAME_REQUIRED } from '../../../Utility/Validation_Message';
import defaultAvatar from "/assets/images/avatar-default.svg";
import { hasUnsavedChanges } from '../../../redux/User/Settings/settingsSlice';
const MyProfile = (props) => {
    const dispatch: AppDispatch = useDispatch();


    // Define initial values
    const initFormValues = {
        username: "",
        email: "",
        mobile: "",
        lastname: "",
        firstname: "",
        university_name: "",
        sub: "",
        profile_image: "",
        file: null

    };

    // useState for saved form data
    const [savedFormData, setSavedFormData] = useState(initFormValues);

    // Define validation schema
    const validationSchema = yup.object({
        email: yup.string()
            .trim()
            .required(EMAIL_REQUIRED),
        firstname: yup.string()
            .trim()
            .required(FIRST_NAME_REQUIRED)
            .matches(ONLY_ALPHABETS_AND_DOT, ENTER_VALID_FIRSTNAME),
        lastname: yup.string()
            .trim()
            .required(LAST_NAME_REQUIRED)
            .matches(ONLY_ALPHABETS_AND_DOT, ENTER_VALID_LASTNAME),
        university_name: yup.string().trim().min(5, "Minimum 5 letters Required.").
            required(UNIVERSITY_NAME_REQUIRED)
            .matches(ONLY_ALPHABETS_AND_DOT, ENTER_VALID_UNIVERSITY),
        file: yup.mixed()
            .nullable()
            .notRequired()
            .test("FILE_SIZE", 'Uploaded file is too big.',
                (value: any) =>
                    !value || (value && value?.size <= FILE_SIZE)
            )
            .test("FILE_FORMAT", "Uploaded file has unsupported format.",
                (value: any) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
            ),

    });

    // onSubmit function
    const onSubmit = async (values, onSubmitProps) => {
        // Handle form submission logic
    };

    // useFormik instance
    const formData: any = useFormik({
        initialValues: savedFormData,
        validationSchema,
        onSubmit,
        enableReinitialize: true,
    });

    // Utility function to handle blur updates
    const handleBlurValueUpdate = (key) => {
        formData.setFieldValue(key, formData.values[key].trim());
        setTimeout(() => {
            formData.setFieldTouched(key, true);
        }, 100);
    };

    // Submission handler
    const handleSubmitFormData = async () => {
        formData.handleSubmit();
        const formDataErrors = await formData.validateForm();
        console.log(formDataErrors)
        if (Object.keys(formDataErrors).length > 0) {
            formData.setTouched(
                setNestedObjectValues(formDataErrors, true)
            );
            return;
        }

        const reqBody = { ...formData.values };
        let params: any = new FormData();
        params.set("userData", JSON.stringify(reqBody));
        if (!isNullUndefinedOrBlank(reqBody.file)) {
            params.append("profile_image", reqBody?.file)
        }
        // customJsonInclude(reqBody);
        const response = await dispatch(updateUserAPI(params));

        if (response) {
            props.getUserData();
        }
    };


    /** ------------------user data set start--------------------------*/
    useEffect(() => {
        if (!isNullUndefinedOrBlank(props.userData)) {
            setSavedFormData(props.userData)
        }
    }, [props.userData])

    /** ------------------user data set end--------------------------*/

    /** --------------------file Change start------------------------*/
    const imageRef = useRef<any>(null);
    const handleFileChange = async (e: any) => {
        const file = e.target?.files[0];
        if (file) {
            await formData.setFieldValue("file", file);
        }
    };

    const handleFileDelete = async () => {
        await formData.setFieldValue("file", null);
        await formData.setFieldValue("profile_image", null);
        imageRef.current.value = null;

    };

    useEffect(() => {
        const handleFileChange = async () => {
            if (isNullUndefinedOrBlank(formData.errors.file) && !isNullUndefinedOrBlank(formData?.values?.file)) {
                const url = URL.createObjectURL(formData.values.file as File);
                await formData.setFieldValue("profile_image", url);
            }
            else {
                if (!isNullUndefinedOrBlank(formData.values?.profile_image) && !isNullUndefinedOrBlank(formData.errors.file)) {
                    if (imageRef?.current) {
                        imageRef.current.value = null;
                    }
                    // await formData.setFieldValue("file", null);
                    await formData.setFieldValue("profile_image", null);
                }
            }
        };

        handleFileChange();

        return () => {
            // Optional cleanup if needed in the future
        };
    }, [formData?.values?.file, formData?.errors?.file]);


    /** --------------------file Change start------------------------*/


    /** ----------------------on cancel start----------------------*/
    // const handleCancel = async () => {
    //     if (!isNullUndefinedOrBlank(props.userData)) {
    //         formData.setValues(props.userData)
    //     }
    // }

    /** ----------------------on cancel End----------------------*/
    // console.log(formData?.values?.profile_image, "abc")

    /** ------------------------Add a confirmation pop to save the changes, if users tries to navaigates towards other pages without 'updating profile'--------------------*/

    // Track if form has unsaved changes
    useEffect(() => {

        if (!isNullUndefinedOrBlank(props.userData) && !isNullUndefinedOrBlank(formData.values)) {
            const hasChanges = JSON.stringify(props.userData) !== JSON.stringify(formData.values);
            props?.setHasUnsavedChanges(hasChanges);
            dispatch(hasUnsavedChanges(hasChanges))
        }
    }, [formData.values, props.userData]);



    useEffect(() => {

        formData.resetForm();
    }, [props?.selectedTab]);



    /** -------------------------Add a confirmation pop to save the changes, if users tries to navaigates towards other pages without 'updating profile' end-------------------*/
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
                                <img src={(!isNullUndefinedOrBlank(formData?.values?.profile_image) && isNullUndefinedOrBlank(formData?.errors?.file)) ? formData?.values?.profile_image : defaultAvatar} alt="OpenPlaner" />
                            </div>

                            <div className="profile-text">
                                <h6>{!isNullUndefinedOrBlank(savedFormData) ? savedFormData?.username : ""}</h6>
                                <div className="button-group">
                                    <Button className="btn btn-white btn-fileupload btn-outline-white btn-sm">
                                        <i className="bi bi-upload"></i> Change
                                        <input type="file" accept="image/x-png,image/jpeg,image/jpg" ref={imageRef}
                                            onChange={async (e: any) => {
                                                if (!isEmptyObjectOrNullUndefiend(e.target?.files)) {
                                                    handleFileChange(e)
                                                }

                                            }} />
                                    </Button>
                                    <Button className="btn btn-white btn-fileupload btn-outline-white btn-sm" onClick={() => { handleFileDelete() }}>
                                        <i className="material-symbols-outlined">delete</i>Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className='profile-error-msg'>
                            {
                                formData?.errors?.file
                                    ? renderError(formData?.errors?.file)
                                    : null
                            }
                        </p>
                        <div className="upload_img_note">
                            <p>Note: Please upload a valid image file (PNG, JPG, JPEG) with a maximum size of 1MB.</p>
                        </div>
                        <div className="main-form-wrapper">
                            <Row>
                                <Col md={6}>
                                    <Form.Group
                                        className="form-group required"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <Form.Label>First Name</Form.Label>
                                        <div className="form-group">
                                            <Form.Control type="text" placeholder="Enter First Name"
                                                {...formData.getFieldProps("firstname")}
                                                maxLength={MAX_50}
                                                onBlur={() => {
                                                    handleBlurValueUpdate("firstname");
                                                }} />
                                        </div>
                                        {
                                            formData.touched.firstname && formData.errors.firstname
                                                ? renderError(formData.errors.firstname)
                                                : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group
                                        className="form-group required"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <Form.Label>Last Name</Form.Label>
                                        <div className="form-group">
                                            <Form.Control type="text" placeholder="Enter Last Name"
                                                {...formData.getFieldProps("lastname")}
                                                maxLength={MAX_50}
                                                onBlur={() => {
                                                    handleBlurValueUpdate("lastname");
                                                }}
                                            />
                                        </div>
                                        {
                                            formData.touched.lastname && formData.errors.lastname
                                                ? renderError(formData.errors.lastname)
                                                : null
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="form-group required">
                                <Form.Label>Email Address</Form.Label>
                                <div className="form-group">
                                    <Form.Control type="email" placeholder="Enter Email"
                                        {...formData.getFieldProps("email")}
                                        maxLength={MAX_50}
                                        disabled={true}
                                        onBlur={() => {
                                            handleBlurValueUpdate("email");
                                        }}
                                    />
                                </div>
                                {
                                    formData.touched.email && formData.errors.email
                                        ? renderError(formData.errors.email)
                                        : null
                                }
                            </Form.Group>
                            <Form.Group className="form-group required">
                                <Form.Label>University Name</Form.Label>
                                <div className="form-group">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter University Name"
                                        {...formData.getFieldProps("university_name")}
                                        maxLength={MAX_50}
                                        onBlur={() => {
                                            handleBlurValueUpdate("university_name");
                                        }}
                                    />
                                </div>
                                {
                                    formData.touched.university_name && formData.errors.university_name
                                        ? renderError(formData.errors.university_name)
                                        : null
                                }
                            </Form.Group>
                        </div>
                        <div className="button-group">
                            <Button variant="primary" className="btn-icon-text" onClick={() => { handleSubmitFormData() }}>
                                <i className="material-symbols-outlined">person</i> Update Profile
                            </Button>
                            {/* <Button variant="outline-white" onClick={() => {
                                handleCancel()
                            }}>
                                Cancel
                            </Button> */}
                        </div>
                    </Card.Body>
                </Card>
            </div>

        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    updateUserAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)


