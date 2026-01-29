import { post } from '../Utility/httpInterceptor';
import {
  GET_TASK_LIST_DATA_API,
  ADD_EDIT_TASK_DATA_API,
  DELETE_TASK_DATA_API,
  UPDATE_TASK_STATUS_DATA_API,
  UPDATE_TASK_STAR_API,
} from '../Utility/ApiList';

/**
 * Task data from the API
 */
export interface Task {
  id: number | string;
  task_name?: string;
  title?: string;
  note?: string;
  due_date?: string;
  end_date?: string;
  status?: string;
  is_starred?: boolean;
  is_reminder?: boolean;
  reminder?: any[];
  priority?: string;
  [key: string]: any;
}

/**
 * Response shape from taskListing API
 */
export interface TaskListingResponse {
  tasks?: Task[];
  pending_task_count?: number;
  completed_task_count?: number;
  [key: string]: any;
}

/**
 * Fetch all tasks
 * 
 * @returns Array of task objects
 * @throws Error if the API returns an error
 */
export const fetchTasks = async (): Promise<Task[]> => {
  const response: any = await post(GET_TASK_LIST_DATA_API, {});
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch tasks');
  }
  
  // API returns either an array directly or { tasks: [...] }
  const payload = response.data.data;
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload?.tasks || [];
};

/**
 * Create or update a task
 */
export interface AddEditTaskParams {
  id?: number | string;
  task_name?: string;
  title?: string;
  note?: string;
  due_date?: string;
  end_date?: string;
  is_reminder?: boolean;
  reminder?: any[];
  priority?: string;
  [key: string]: any;
}

export const addEditTask = async (params: AddEditTaskParams): Promise<any> => {
  const response: any = await post(ADD_EDIT_TASK_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to save task');
  }
  
  return response.data.data;
};

/**
 * Delete one or more tasks
 */
export interface DeleteTaskParams {
  id: (number | string)[];
}

export const deleteTask = async (params: DeleteTaskParams): Promise<any> => {
  const response: any = await post(DELETE_TASK_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to delete task');
  }
  
  return response.data.data;
};

/**
 * Update task status (complete/incomplete)
 */
export interface UpdateTaskStatusParams {
  id: (number | string)[];
  status: string;
}

export const updateTaskStatus = async (params: UpdateTaskStatusParams): Promise<any> => {
  const response: any = await post(UPDATE_TASK_STATUS_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to update task status');
  }
  
  return response.data.data;
};

/**
 * Update task star status
 */
export interface UpdateTaskStarParams {
  task_id: number | string;
  is_starred: boolean;
}

export const updateTaskStar = async (params: UpdateTaskStarParams): Promise<any> => {
  // Try REST endpoint first: POST /tasks/:id/star
  try {
    const response: any = await post(`tasks/${params.task_id}/star`, { is_starred: params.is_starred });
    if (!response.data.error) {
      return response.data.data;
    }
  } catch {
    // Fall through to legacy endpoint
  }
  
  // Legacy endpoint: POST /updateTaskStar
  const response: any = await post(UPDATE_TASK_STAR_API, {
    task_id: [params.task_id],
    is_starred: params.is_starred,
  });
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to update task star');
  }
  
  return response.data.data;
};
