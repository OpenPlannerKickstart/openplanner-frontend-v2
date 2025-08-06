/**
 * Enum for status values.
 */
export const ENUMFORSTATUS = {
  PENDING: "Pending",
  INPROGRESS: "Inprogress",
  COMPLETED: "Completed",
  INCOMPLETE: "Incomplete",
} as const;

/**
 * Enum for stone master tab names.
 */
export const ENUMFORSTONEMASTERTAB = {
  LOTSIZE: "LOTSIZE",
  ARTICLE: "ARTICLE",
  SIEVES: "SIEVES",

}
export const ENUM_FOR_EVENT_PRIORITY={
  LOW:"Low",
  MEDIUM:"Medium",
  HIGH:"High"

}


/**
 * Enum for route paths.
 */
export const ENUMFORROUTES = {

  DASHBOARD: "/dashboard",
  REPORTS: "/reports",
  LOGIN: "/login",
  FORGOTPASSWORD: "/forgot-password",
  NEWPASSWORD: "/set-new-password",
  REGISTRATION: "/registration",
  PAGE_COMPONENT: "/page-component",
  ACCESS_DENIED: "/access-denied",
  USER_MANGEMNET: "/user-mangemnet",
  COURSES: "/courses",
  TASK: "/task",
  CALENDAR: "/calendar",
  SETTINGS: "/settings",
  VERIFY_SIGNUP_OTP: "/verify-user-otp",
  EDIT_COURSE:"/edit-course"

}



/**
 * Enum for account tab names.
 */
export const ENUMFORACCOUNTTAB = {
  PERSONAL_DETAILS: "Personal Details",
  NOTIFICATION: "Notification",
  CHANGE_PASSWORD: "Change Password",
  DELETE_ACCOUNT: "Delete Account",
  SUBSCRIPTION: "Subscription"
} as const;

export const ENUM_FOR_DISPLAY_VIEW = {
  LIST_VIEW: "List View",
  GRID_VIEW: "Grid View"

} as const;
export const ENUM_FOR_SYLLABUS_TAB = {
  SYLLABUS_DETAILS: "Syllabus Details",
  EVENT_DETAILS: "Event Details",

} as const;


/**
 * Enum for task module
 */

export const ENUMFORTASK = {
  OPEN: "Pending",
  COMPLETED: "Completed"
}


export const ENUMFORDASHBORD = {
  PENDING_EVENT: "Pending Event",
  COMPLETED_EVENT: "Complete Event",
  PENDING_TASK: "Pending Task",
  COMPLETED_TASK: "Complete Task"
}


export const DELETE_DOCUMENT_TYPE = {
  REMOVE: "Remove",
  UPLOAD: "Upload",
}