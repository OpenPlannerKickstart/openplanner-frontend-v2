// API functions
export { fetchSyllabusDropdown } from './syllabus';
export type { SyllabusDropdownItem } from './syllabus';

export { fetchUser } from './user';
export type { UserData } from './user';

export { fetchCourses } from './courses';
export type { Course } from './courses';

export {
  fetchTasks,
  addEditTask,
  deleteTask,
  updateTaskStatus,
  updateTaskStar,
} from './tasks';
export type {
  Task,
  TaskListingResponse,
  AddEditTaskParams,
  DeleteTaskParams,
  UpdateTaskStatusParams,
  UpdateTaskStarParams,
} from './tasks';

export {
  fetchCalendarEvents,
  addEditEvent,
  addEditEventSilent,
  deleteEvent,
  updateEventStatus,
} from './events';
export type {
  CalendarEvent,
  AddEditEventParams,
  DeleteEventParams,
  UpdateEventStatusParams,
} from './events';
