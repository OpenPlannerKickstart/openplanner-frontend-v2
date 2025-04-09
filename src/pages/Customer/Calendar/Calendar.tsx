import React from 'react'

const Calendar = () => {
  return (
    <>
         <div className="page-content">
            <div className="page-title-wrapper">
                <div className="page-title-left">
                    <div className="page-title">
                        <h4>Calendar</h4>
                    </div>
                </div>
                <div className="page-title-right">
                    <button
                    type="button"
                    className="btn btn-primary"
                    >
                    Add Event
                    </button>            
                    <button
                    type="button"
                    className="btn btn-warning"
                    >
                    Add Syllabus
                    </button>            
                </div>
            </div>

            <div className="content-area  content-area-title">
                <div className="page-content-wrapper h-100">

                </div>
            </div>
        </div>
    </>
  )
}

export default Calendar