import React from 'react'
import { Card } from 'react-bootstrap'

const Notification = () => {
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
                      <input type="checkbox" id='switch' />
                      <div className="slider round"></div>
                    </label>
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
                      <input type="checkbox" id='switch2' />
                      <div className="slider round"></div>
                    </label>
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