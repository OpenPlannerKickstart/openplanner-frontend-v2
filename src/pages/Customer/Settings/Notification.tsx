import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { customJsonInclude, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from '../../../Utility/Helper';
import { getNotificationSettingAPI, notificationSettingAPI } from '../../../redux/Service/User/Settings/settings';
import { ENUMFORACCOUNTTAB } from '../../../interfaces/enum';

const Notification = (props) => {
  const dispatch: AppDispatch = useDispatch();

  // Define initial values
  const initFormValues = {
    isWeeklyNotofication: false,
    isEmailNotification: false,
    // Add other fields here
  };

  // useState for saved form data
  const [savedFormData, setSavedFormData] = useState(initFormValues);

  // Define validation schema
  const validationSchema = yup.object({

  });

  // onSubmit function
  const onSubmit = async (values, onSubmitProps) => {
    // Handle form submission logic
  };

  // useFormik instance
  const formData: any = useFormik({
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
    const response = await dispatch(notificationSettingAPI(reqBody));

    if (response) {
      // Handle successful response
    }
  };
  const [userChanged, setUserChanged] = useState(false);
  useEffect(() => {
    if (userChanged) {
      handleSubmitFormData();
    }
  }, [formData.values.isWeeklyNotofication, formData.values.isEmailNotification]);

  const handleGetNotificationData = async () => {
    const response = await dispatch(getNotificationSettingAPI());
    if (response) {
      setSavedFormData(response.payload);
      setUserChanged(false); // Reset flag on load
    }
  }

  useEffect(() => {
    if (props?.selectedTab === ENUMFORACCOUNTTAB.NOTIFICATION) {
      handleGetNotificationData();
    }
    return () => {

    }
  }, [props?.selectedTab])

  return (
    <>
      <div className="profile-main-wrapper">
        <Card>
          <Card.Body>
            <div className="setting-main-title">
              <h2>Notification Settings</h2>
            </div>
            <div className="notifiction-wrapper">
              <div className="notifiction-box">
                <div className="title-text">
                  <h2>Weekly Notifications</h2>
                  <p>Weekly notify events, syllabus and tasks</p>
                </div>
                <div className="notify-switch">
                  <div className="switch-box ">
                    <label className="switch" htmlFor="switch">
                      <input type="checkbox" id='switch'
                        checked={formData.values.isWeeklyNotofication} onChange={() => { setUserChanged(true); formData.setFieldValue('isWeeklyNotofication', !formData.values.isWeeklyNotofication) }}
                      />
                      <div className="slider round"></div>
                    </label>
                    {
                      formData.touched.isWeeklyNotofication && formData.errors.identifier
                        ? renderError(formData.errors.isWeeklyNotofication)
                        : null
                    }
                  </div>
                </div>
              </div>
              <div className="notifiction-box">
                <div className="title-text">
                  <h2>Email Notification</h2>
                  <p>Send email on task/Event coaptation</p>
                </div>
                <div className="notify-switch">
                  <div className="switch-box ">
                    <label className="switch" htmlFor="switch2">
                      <input type="checkbox" id='switch2' checked={formData.values.isEmailNotification} onChange={() => { setUserChanged(true); formData.setFieldValue('isEmailNotification', !formData.values.isEmailNotification) }} />
                      <div className="slider round"></div>
                    </label>
                    {
                      formData.touched.isEmailNotification && formData.errors.isEmailNotification
                        ? renderError(formData.errors.isEmailNotification)
                        : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Notification