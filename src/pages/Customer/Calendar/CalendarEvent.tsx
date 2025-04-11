import React, { useEffect, useState } from 'react'
import { formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { AppDispatch } from '../../../redux/store';
import { connect, useDispatch } from 'react-redux';
import { getCalenderDataAPI } from '../../../redux/Service/calender';
import DatePicker from 'react-datepicker';

const localizer: any = momentLocalizer(moment);
const CalenderEvent = () => {
    const dispatch: AppDispatch = useDispatch()

    const customToolbar = ({ date, onNavigate }) => {
        const goToBack = () => {
            onNavigate("PREV");
        };
        const goToNext = () => {
            onNavigate("NEXT");
        };

        const goToToday = () => {
            onNavigate("TODAY");
        };
        return (
            <div className='calendar-header'>
                <div className="rbc-toolbar">
                    <div className="calendar-month">
                        <button onClick={() => { goToToday() }}>
                            Today
                        </button>
                        <button onClick={() => { goToBack() }}>
                            {'<'}
                        </button>
                        <span>{formatedDate(date, 'MMMM YYYY')}</span>
                        {/* <span>{`${moment(toolbar.date)}`}</span> */}
                        <button onClick={() => { goToNext() }}>
                            {'>'}
                        </button>
                    </div>

                </div>

            </div>
        );
    };

    const handleSelectEvent = (event) => {
        console.log(event)
    }
    const [selectedMonth, setSelectedMonth] = useState<any>(null);
    const handleNavigateEvent = (event) => {
        const currentMonth = formatedDate(new Date(event), "YYYY-MM");
        setSelectedMonth(currentMonth);
    }

    function customEventView({ event }) {
        return (
            <div key={Math.random()}>
                <div className={`rbc-event-primary`}>
                    <p> <b className='text-black'>{event.title} </b> </p>
                </div>
            </div>
        );
    }


    /** ----------------------get CalenderData Start----------------------*/
    const [searchByStartDate, setSearchByStartDate] = useState<any>(null);
    const [searchByEndDate, setSearchByEndDate] = useState<any>(null);
    const [calenderData, setCalenderData] = useState<any>([

    ])
    function formatDate(dateStr) {
        const date = moment(dateStr).utc();

        const year = date.year();
        const month = date.month(); // No need to add 1 because `moment` handles it properly when creating a new Date
        const day = date.date();
        const hours = date.hour();
        const minutes = date.minute();
        const seconds = date.second();

        // Return a Date object directly
        return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    }

    const handleGetCalenderData = async () => {
        console.log(searchByStartDate)
        const reqBody = {
            start_date: searchByStartDate,
            end_date: searchByEndDate,

        };
        const response = await dispatch(getCalenderDataAPI(reqBody));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            const eventData = response?.payload?.map((item) => {
                return {
                    ...item,
                    start: formatDate(item.start),
                    end: formatDate(item.end),
                };
            });
            setCalenderData(eventData);
        }
    };

    useEffect(() => {
        handleGetCalenderData();
    }, [searchByStartDate, searchByEndDate])

    /** ----------------------get CalenderData End----------------------*/


    /** ---------------------get syllabus dropdown Start-----------------------*/

    /** ---------------------get syllabus dropdown End-----------------------*/


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
                        <DatePicker
                            toggleCalendarOnIconClick
                            selectsRange={true}
                            onChange={(dates) => {
                                const [start, end] = dates;
                                setSearchByStartDate(start ? start : null);
                                setSearchByEndDate(end ? end : null);

                            }}
                            startDate={searchByStartDate}
                            endDate={searchByEndDate}
                            isClearable
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Select a Date"
                        />
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

                        <Calendar
                            localizer={localizer}
                            events={calenderData}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            onSelectEvent={(event) => { handleSelectEvent(event) }}
                            onNavigate={(e) => { handleNavigateEvent(e) }}
                            // views={['month', '']}
                            showAllEvents={true}

                            components={{
                                event: customEventView,
                                // toolbar: customToolbar,
                            }}
                            popup
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    getCalenderDataAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(CalenderEvent)

