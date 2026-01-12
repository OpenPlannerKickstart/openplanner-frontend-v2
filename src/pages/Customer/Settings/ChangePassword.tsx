import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { customJsonInclude, renderError } from '../../../Utility/Helper';
import { NEW_PASSWORD_IS_REQUIRED, OLD_PASSWORD_IS_REQUIRED } from '../../../Utility/Validation_Message';
import { CONFIRM_PASSWORD_NOT_MATCHED, MAX_32, PASSWORD_INVALID, PATTERN_FOR_PASSWORD, PATTERN_FOR_PASSWORD_NEW } from '../../../Utility/Validation_Helper';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { changePasswordAPI } from '../../../redux/Service/User/Settings/settings';
import './Settings.css';

const ChangePassword: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [eyeToggle, setEyeToggle] = useState<boolean>(false);
    const [eyeToggleTwo, setEyeToggleTwo] = useState<boolean>(false);
    const [eyeToggleThree, setEyeToggleThree] = useState<boolean>(false);
    /** -------------------change password start-------------------------*/

    // Define initial values
    const initFormValues = {
        oldPassword: "",
        newPassword: "",
        confirm: ""
    };

    // useState for saved form data
    const [savedFormData, setSavedFormData] = useState(initFormValues);

    // Define validation schema
    const validationSchema = yup.object({
        oldPassword: yup.string()
            .trim()
            .required(OLD_PASSWORD_IS_REQUIRED),
        newPassword: yup.string()
            .trim()
            .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
            .required(NEW_PASSWORD_IS_REQUIRED),
        confirm: yup
            .string()
            .when('newPassword', ([newPassword]) => {
                return newPassword?.length > 0 ? yup.string().required("Confirm Password Is Required!!").oneOf([yup.ref("newPassword")], `${CONFIRM_PASSWORD_NOT_MATCHED}`) : yup.string()

            }),
    });

    // onSubmit function
    const onSubmit = async (values: any, onSubmitProps: any) => {
        try {
            const reqBody = { ...values };
            customJsonInclude(reqBody);
            
            const response = await dispatch(changePasswordAPI(reqBody));
            if (response?.payload) {
                formData.resetForm();
                // Handle successful response - maybe show success message
            }
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            onSubmitProps.setSubmitting(false);
        }
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
        formData.setFieldValue(key, formData?.values[key]?.trim());
        setTimeout(() => {
            formData.setFieldTouched(key, true);
        }, 100);
    };

    // Submission handler
    const handleSubmitFormData = async () => {
        const formDataErrors = await formData.validateForm();
        if (Object.keys(formDataErrors).length > 0) {
            formData.setTouched(
                setNestedObjectValues(formDataErrors, true)
            );
            return;
        }
        
        // Trigger formik submit which will call onSubmit
        formData.handleSubmit();
    };

    /** -------------------change password end-------------------------*/

    return (
        <div className="settings-card">
            <h2 className="settings-card-title">Change Password</h2>
                        <div className="main-form-wrapper">
                            <Form.Group className='form-group'>
                                <Form.Label>Current Password</Form.Label>
                                <div className="form-group-icon-start form-group-password">
                                    <i className="material-symbols-outlined">lock</i>
                                    <Form.Control type={eyeToggle ? "text" : "password"} autoComplete='new password' placeholder='Enter current password'

                                        {...formData.getFieldProps("oldPassword")}
                                        maxLength={MAX_32}

                                        onBlur={() => {
                                            handleBlurValueUpdate("oldPassword");
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
                                    formData.touched.oldPassword && formData.errors.oldPassword
                                        ? renderError(formData.errors.oldPassword)
                                        : null
                                }
                            </Form.Group>
                            <Form.Group className='form-group'>
                                <Form.Label>New Password</Form.Label>
                                <div className="form-group-icon-start form-group-password">
                                    <i className="material-symbols-outlined">lock</i>
                                    <Form.Control type={eyeToggleTwo ? "text" : "password"} placeholder='Enter new password'
                                        {...formData.getFieldProps("newPassword")}
                                        maxLength={MAX_32}
                                        autoComplete='new-password'
                                        onBlur={() => {
                                            handleBlurValueUpdate("newPassword");
                                        }}
                                    />
                                    <button
                                        onClick={() => setEyeToggleTwo(!eyeToggleTwo)}
                                        className="btn-password"
                                    >
                                        <i className="material-symbols-outlined">{eyeToggleTwo ? "visibility" : "visibility_off"}</i>
                                    </button>
                                </div>
                                {
                                    formData.touched.newPassword && formData.errors.newPassword
                                        ? renderError(formData.errors.newPassword)
                                        : null
                                }
                            </Form.Group>
                            <Form.Group className='form-group '>
                                <Form.Label>Confirm Password</Form.Label>
                                <div className="form-group-icon-start form-group-password">
                                    <i className="material-symbols-outlined">lock</i>
                                    <Form.Control type={eyeToggleThree ? "text" : "password"} placeholder='Re-enter new password'
                                        {...formData.getFieldProps("confirm")}
                                        maxLength={MAX_32}
                                        autoComplete='new-password'
                                        onBlur={() => {
                                            handleBlurValueUpdate("confirm");
                                        }}
                                    />
                                    <button
                                        onClick={() => setEyeToggleThree(!eyeToggleThree)}
                                        className="btn-password"
                                    >
                                        <i className="material-symbols-outlined">{eyeToggleThree ? "visibility" : "visibility_off"}</i>
                                    </button>
                                </div>
                                {
                                    formData.touched.confirm && formData.errors.confirm
                                        ? renderError(formData.errors.confirm)
                                        : null
                                }
                            </Form.Group>
                        </div>
            <div className="form-actions">
                <button 
                    type="button"
                    className="btn btn-primary" 
                    onClick={() => { handleSubmitFormData() }}
                >
                    Change Password
                </button>
            </div>
        </div>
    )
}

export default ChangePassword
