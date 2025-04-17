import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { PASSWORD_REQUIRED, REASON_IS_REQUIRED } from '../../../Utility/Validation_Message';
import { customJsonInclude, renderError } from '../../../Utility/Helper';
import { deleteAPI } from '../../../Utility/httpInterceptor';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { deleteUserAPI } from '../../../redux/Service/settings';
import { MAX_200 } from '../../../Utility/Validation_Helper';
import { logoutFromSystem } from '../../../redux/Service/auth/login';

const DeleteAccount = () => {
    const dispatch: AppDispatch = useDispatch();
    const [eyeToggle, setEyeToggle] = useState<boolean>(false);
    const callLogout = async () => {
        await dispatch(logoutFromSystem());
    };

    /** --------------------delete account start------------------------*/


    // Define initial values
    const initFormValues = {
        reason: "",
        password: "",
        // Add other fields here
    };

    // useState for saved form data
    const [savedFormData, setSavedFormData] = useState(initFormValues);

    // Define validation schema
    const validationSchema = yup.object({
        reason: yup.string()
            .trim()
            .required(REASON_IS_REQUIRED),
        password: yup.string()
            .trim()
            .required(PASSWORD_REQUIRED),

    });

    // onSubmit function
    const onSubmit = async (values, onSubmitProps) => {
        // Handle form submission logic
    };

    // useFormik instance
    const formData = useFormik({
        initialValues: savedFormData || initFormValues,
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
        if (Object.keys(formDataErrors).length > 0) {
            formData.setTouched(
                setNestedObjectValues(formDataErrors, true)
            );
            return;
        }

        const reqBody = { ...formData.values };
        customJsonInclude(reqBody);
        // console.log(reqBody)
        const response = await dispatch(deleteUserAPI(reqBody));

        if (response) {
            formData.resetForm();
            callLogout();
        }
    };
    /** --------------------delete account end------------------------*/

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
                                <Form.Control as="textarea" placeholder="Enter reason to delete account" rows={3}
                                    {...formData.getFieldProps("reason")}
                                    maxLength={MAX_200}

                                    onBlur={() => {
                                        handleBlurValueUpdate("reason");
                                    }} />
                                {
                                    formData.touched.reason && formData.errors.reason
                                        ? renderError(formData.errors.reason)
                                        : null
                                }
                            </Form.Group>
                            <Form.Group className='form-group '>
                                <Form.Label>Password</Form.Label>
                                <div className="form-group form-group-password">
                                    <Form.Control type="password" placeholder='Enter password'
                                        {...formData.getFieldProps("password")}
                                        maxLength={MAX_200}

                                        onBlur={() => {
                                            handleBlurValueUpdate("password");
                                        }}
                                    />
                                    <button
                                        onClick={() => setEyeToggle(!eyeToggle)}
                                        className="btn-password"
                                    >
                                        <i className="material-symbols-outlined">{eyeToggle ? "visibility" : "visibility_off"}</i>
                                    </button>
                                </div>
                                {
                                    formData.touched.password && formData.errors.password
                                        ? renderError(formData.errors.password)
                                        : null
                                }
                            </Form.Group>
                        </div>
                        <div className="button-group">
                            <Button variant="danger" className="btn-icon-text" onClick={() => { handleSubmitFormData() }}>
                                <i className="material-symbols-outlined">delete</i> Delete Account
                            </Button>
                            {/* <Button variant="outline-white">
                                Cancel
                            </Button> */}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default DeleteAccount