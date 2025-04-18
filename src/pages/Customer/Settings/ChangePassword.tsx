import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { customJsonInclude, renderError } from '../../../Utility/Helper';
import { NEW_PASSWORD_IS_REQUIRED, OLD_PASSWORD_IS_REQUIRED } from '../../../Utility/Validation_Message';
import { CONFIRM_PASSWORD_NOT_MATCHED, MAX_50, PASSWORD_INVALID, PATTERN_FOR_PASSWORD, PATTERN_FOR_PASSWORD_NEW } from '../../../Utility/Validation_Helper';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { changePasswordAPI } from '../../../redux/Service/User/Settings/settings';

const ChangePassword = () => {
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
        formData.setFieldValue(key, formData?.values[key]?.trim());
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
        customJsonInclude(reqBody);

        const response = await dispatch(changePasswordAPI(reqBody))
        if (response) {
            formData.resetForm();
            // Handle successful response
        }
    };

    /** -------------------change password end-------------------------*/

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
                                    <Form.Control type={eyeToggle ? "text" : "password"} placeholder='Enter current password'
                                        {...formData.getFieldProps("oldPassword")}
                                        maxLength={MAX_50}
                                        onBlur={() => {
                                            handleBlurValueUpdate("oldPassword");
                                        }}
                                        autoComplete='new password'
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
                                        maxLength={MAX_50}
                                        autoComplete='off'
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
                                        maxLength={MAX_50}
                                        autoComplete='off'
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
                        <div className="button-group">
                            <Button variant="primary" className="btn-icon-text" onClick={() => { handleSubmitFormData() }}>
                                <i className="material-symbols-outlined">key</i> Change Password
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

export default ChangePassword