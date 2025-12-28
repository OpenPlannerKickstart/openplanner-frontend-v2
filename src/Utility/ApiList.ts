
// const PATH_FOR_API = "";
// const PATH_FOR_W_O_TOKEN = "woToken/";
// const PATH_FOR_TEST = "test/";

/**API endpoint for registering new user  */
export const GET_REGISTER_DATA_API = "registerUser";
export const GET_UNIVERSITY_LIST_API = "getUniversityList";
export const ADD_OTHER_UNIVERSITY_NAME_API = "addOtherUniversityName";


/** API endpoint for user login */
export const GET_LOGIN_DATA_API = "loginUser";
/** API endpoint for Verify User Otp */
export const GET_VERIFY_USER_OTP_DATA_API = "verifySignUp";
/** API endpoint for Resend User Otp */
export const GET_RESEND_USER_OTP_DATA_API = "resendConfirmSignupOtp";
/** API endpoint for Resend User Otp */
export const SEND_EMAIL_OTP_FOR_NEW_PASSWORD_DATA_API = "forgotPasswordOtpGenerator";
/** API endpoint for New Password */
export const SEND_NEW_PASSWORD_DATA_API = "resetPassword";
/** API endpoint for Courses API Start */
export const GET_COURSES_LIST_DATA_API = "syllabusListing";
export const GET_EVENT_LIST_DATA_API = "eventListing";
export const ADD_EDIT_SYLLABUS_DATA_API = "addEditSyllabus";
export const ADD_EDIT_EVENT_DATA_API = "addEditEvent";
export const DELETE_SYLLABUS_DATA_API = "deleteSyllabus";
export const DELETE_EVENT_DATA_API = "deleteEvent";
export const UPDATE_SYLLABUS_STATUS_DATA_API = "updateSyllabusStatus";
export const UPDATE_EVENT_STATUS_DATA_API = "updateEventStatus";
export const GET_SYLLABUS_DROP_DOWN_DATA_API = "getSyllabusDropDown";
/** API endpoint for Courses API END */

/** API endpoint for fetching city data  */
export const GET_CITY_DATA_API = "city";
/** API endpoint for fetching state data */
export const GET_STATE_DATA_API = "state";
/**API endpoint for fetching country data  */
export const GET_COUNTRY_DATA_API = "country";

/**API endpoint for fetching calender data */
export const GET_CALENDER_DATA = "getCalenderDataWeb";
/**API endpoint for fetching calender data */
export const GET_SYLLABUS_DROPDOWN_DATA_API = "getSyllabusDropDown";

/**API endpoint for fetching task list data */
export const GET_TASK_LIST_DATA_API = "taskListing";
/**API endpoint for adding/editing task data */
export const ADD_EDIT_TASK_DATA_API = "addEditTask";
/**API endpoint for updating task status */
export const UPDATE_TASK_STATUS_DATA_API = "updateTaskStatus";
/**API endpoint for starring/unstarring task */
export const UPDATE_TASK_STAR_API = "updateTaskStar";
/**API endpoint for deleting task data */
export const DELETE_TASK_DATA_API = "deleteTask";
export const GET_USER_API = "getUserData";
export const UPDATE_USER_API = "updateProfile";
export const DELETE_USER_API = "verifyPasswordAndDeleteUser";
export const CHANGE_PASSWORD_API = "changePassword";


// API endpoints for dashboard-related requests
export const DASHBOARD_LISTING_COUNT_API = "dashboardListingCount";
export const DASHBOARD_COURSES_DATA_API = "dashboardCoursesData";
export const DASHBOARD_TASKS_DATA_API = "dashboardTasksData";
export const DASHBOARD_EVENTS_DATA_API = "dashboardEventsData";
// export const DASHBOARD_EVENT_LISTING_API = "dashboardEventListing";
export const DASHBOARD_EVENT_LISTING_API = "currWeekEventListing";
export const GET_SYLLABUS_DROPDOWN_API = "getSyllabusDropDown";



export const GET_ALL_NOTIFICATION_API = "getNotificationData";
export const GET_COUNT_OF_UNREAD_NOTIFICATION_API = "countNotification";
export const READ_NOTIFICATION_API = "markAsRead";
export const CLEAR_NOTIFICATION_API = "deleteNotifiction";
export const NOTIFICATION_SETTING = "addEditNotificationSetting"
export const GET_NOTIFICATION_SETTINGS_API = "getNotificationSettingData"
// socket api 
export const NOTIFICATION_ALERT = `/topic/notification/`;
export const CREATE_CHECKOUT_API = `createCheckoutSession`;
export const TRANSACTION_LISTING = `transactionListing`;
export const CANCEL_TRANSACTION = 'subscriptionCancel'
export const UPDATE_PLAN = 'updatePlan'
export const PLAN_MASTER = 'getMstProdPlan'

// Parents purchase flow
export const PARENTS_CREATE_SESSION = 'api/parents/subscription/checkout/session'
export const PARENTS_CODES_BY_SESSION = 'api/parents/code'
export const PARENTS_BILLING_PORTAL = 'api/parents/billing/portal'
export const PARENTS_SUBSCRIPTION_FINALIZE = 'api/parents/subscription/finalize'
// Subscription status (student)
export const SUBSCRIPTION_STATUS = 'api/subscription/status'
// Student redeem flow
export const REDEEM_CODE = 'api/redeem'
// Student billing portal
export const STUDENT_BILLING_PORTAL = 'api/billing/portal'
// Freemium plan registration
export const SUBSCRIPTION_FREEMIUM = 'api/subscription/freemium'


