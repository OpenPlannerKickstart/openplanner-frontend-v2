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
    VERIFY_SIGNUP_OTP:"/verify-user-otp"
  
  }
  
  
  
  /**
   * Enum for account tab names.
   */
  export const ENUMFORACCOUNTTAB = {
    PERSONAL_DETAILS: "Personal Details",
    UPDATE_PASSWORD: "Update Password"
  
  } as const;

  export const ENUM_FOR_DISPLAY_VIEW = {
   LIST_VIEW:"List View",
   GRID_VIEW:"Grid View"
  
  } as const;