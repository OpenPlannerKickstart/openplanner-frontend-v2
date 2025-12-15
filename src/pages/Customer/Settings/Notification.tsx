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

interface NotificationProps {
  selectedTab: string;
}

const Notification: React.FC<NotificationProps> = (props) => {
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
  const onSubmit = async (values: any, onSubmitProps: any) => {
    try {
      const reqBody = { ...values };
      customJsonInclude(reqBody);
      
      const response = await dispatch(notificationSettingAPI(reqBody));
      if (response?.payload) {
        setSavedFormData({ ...values });
        // Handle successful response
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
      onSubmitProps.setSubmitting(false);
    }
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
    const formDataErrors = await formData.validateForm();
    if (Object.keys(formDataErrors).length > 0) {
      formData.setTouched(
        setNestedObjectValues(formDataErrors, true)
      );
      return;
    }
    
    // Trigger formik submit
    formData.handleSubmit();
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
                  <p>Receive a weekly update every Sunday at 5pm on your upcoming tasks</p>
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
                  <p>Receive emails for task and event notifications.</p>
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