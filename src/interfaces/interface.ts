
import Login from '../pages/auth/Login/Login';

/**
 * Response wrapper data transfer object interface.
 */
export interface ResponseWrapperDTO {
  status: string;
  message: string;
  data: any;
  path?: string;
  error: boolean;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  account?: string;
}
/**
 * Page request interface.
 */
export interface PageRequest {
  pageNo: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  searchText?: string;
  ids?: any;
}
/**
 * Common props interface.
 */
export interface CommonProps {
  className: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  searchTxt: string | undefined;
  value: string | number | readonly string[] | undefined;
}
/**
 * Modal context props interface.
 */
export interface ModalContextProps {
  modal: boolean;
  handleModal: (content?: any, value?: any, dismissModal?: boolean) => void;
  modalContent: any;
  modalValue: any;
}
/**
 * Routes list interface.
 */
export interface RoutesList {
  path: string; // the url
  icon: JSX.Element;
  name: string; // name that appear in Sidebar
  exact: boolean;
}
/**
 * Pagination props interface.
 */
export interface PaginationProps {
  onPageChange: any;
  totalCount: number;
  siblingCount?: 1 | undefined;
  currentPage: number;
  pageSize: number;
  className: string;
  onPageSizeChange: any;
  otherHtml?: any;
}
/**
 * Button props interface.
 */
export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  text?: any;
  disabled?: any;
  icon?: JSX.Element;
  children?: any;
}

/**
 * Router props interface.
 */
export interface RouterProps {
  component?: any;
  path: string;
  caseSensitive?: boolean;
  accessType?: any;
  url?: any;
}

/**
 * Dropdown list format interface.
 */
export interface DropdownListFormat {
  label: string;
  value: any;
  sub?: Array<DropdownListFormat>;
  other?: any;
}
/**
 * Page interface.
 */
export interface Page {
  pageUrl: string;
  id: number;
  pageCode: string;
  status: number;
  accessType: string;
}
/**
 * Notification interface.
 */
export interface Notification {
  id: any;
  notificationType: string;
  isNotification: boolean;
}
/**
 * Login data interface.
 */
export interface LoginData {
  identifier: string;
  password: string;

}
/**
 * SignUp data interface.
 */
export interface SignUpData {
  first_name: string;
  last_name: string;
  university_name: string;
  email: string;
  password: string;
  mobile: string;
  username: string;

}


export interface SyllabusResponseType{  
  id: number;
  user_id: string;
  title: string;
  doc_id: number;
  start_date: string; 
  end_date: string;  
  class_time: string; 
  professor_name: string;
  course_color: string; 
  is_reminder: boolean;
  status: any;
  updated_at: string; 
  no_of_events: string; 
  syllabus_doc: any; 

}
export interface addSyllabusData{  
  id?: number;
  title: string;   
  class_time: string; 
  professor_name: string;
  course_color: string;  
  syllabus_doc?: any; 
  syllabus_doc_name?: any; 

}

export interface addEvenData{
  event_id?: number;
  title: string;   
  start_date: any; 
  end_date: any; 
  note?: string;
  is_all_day_event?: boolean;
  is_reminder?: boolean;
  reminder?: any;
  syllabus_id?: number;
}
 
export interface Task {
  id: number;
  user_id: string;
  task_name: string;
  due_date: string;
  note: string;
  is_reminder?: boolean;
  status?: string;
  isactive?: boolean;
  isdeleted?: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  reminder?: Reminder[];
  task_id?: any;
}

export interface Reminder {
  unit: string
  value: string;
}