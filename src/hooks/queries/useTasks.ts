import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { invalidateOnTaskChange } from '../../lib/invalidationMap';
import {
  fetchTasks,
  addEditTask,
  deleteTask,
  updateTaskStatus,
  updateTaskStar,
  Task,
  AddEditTaskParams,
  DeleteTaskParams,
  UpdateTaskStatusParams,
  UpdateTaskStarParams,
} from '../../api/tasks';
import { ts } from '../../Utility/Toaster';

/**
 * Hook to fetch and cache all tasks.
 * 
 * Used on the Tasks page and anywhere task listings are needed.
 * 
 * Features:
 * - Returns cached data instantly on subsequent visits
 * - Refetches in background when stale (1 min)
 * - Cache invalidated on task create/edit/delete/status change
 * 
 * @example
 * const { data: tasks = [], isLoading } = useTasks();
 */
export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: queryKeys.tasks,
    queryFn: fetchTasks,
    staleTime: staleTimeConfig.taskListing,
  });
}

/**
 * Mutation hook for creating/editing tasks with optimistic updates.
 */
export function useAddEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEditTask,
    onSuccess: (data, variables) => {
      // Show success toast
      ts(variables.id ? 'Task updated successfully' : 'Task created successfully');
      // Invalidate related caches
      invalidateOnTaskChange(queryClient);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to save task');
    },
  });
}

/**
 * Mutation hook for deleting tasks.
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (variables: DeleteTaskParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(queryKeys.tasks);

      // Optimistically remove the tasks from the list
      if (previousTasks) {
        const idsToDelete = variables.id.map(String);
        queryClient.setQueryData<Task[]>(
          queryKeys.tasks,
          previousTasks.filter((task) => !idsToDelete.includes(String(task.id)))
        );
      }

      return { previousTasks };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks, context.previousTasks);
      }
      ts(error.message || 'Failed to delete task');
    },
    onSuccess: () => {
      ts('Task deleted successfully');
      invalidateOnTaskChange(queryClient);
    },
  });
}

/**
 * Mutation hook for toggling task status (complete/incomplete) with optimistic updates.
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async (variables: UpdateTaskStatusParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(queryKeys.tasks);

      // Optimistically update the tasks
      if (previousTasks) {
        const idsToUpdate = variables.id.map(String);
        queryClient.setQueryData<Task[]>(
          queryKeys.tasks,
          previousTasks.map((task) =>
            idsToUpdate.includes(String(task.id))
              ? { ...task, status: variables.status }
              : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (_error: Error, _variables, context) => {
      // Rollback on error (no toast - silent operation)
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks, context.previousTasks);
      }
    },
    onSuccess: () => {
      // No toast for status changes - they should feel instant
      invalidateOnTaskChange(queryClient);
    },
  });
}

/**
 * Mutation hook for starring/unstarring tasks with optimistic updates.
 */
export function useUpdateTaskStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStar,
    onMutate: async (variables: UpdateTaskStarParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(queryKeys.tasks);

      // Optimistically update the task
      if (previousTasks) {
        const taskId = String(variables.task_id);
        queryClient.setQueryData<Task[]>(
          queryKeys.tasks,
          previousTasks.map((task) =>
            String(task.id) === taskId
              ? { ...task, is_starred: variables.is_starred }
              : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (_error: Error, _variables, context) => {
      // Rollback on error (no toast - silent operation)
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks, context.previousTasks);
      }
    },
    onSuccess: () => {
      // No toast for star changes - they should feel instant
      invalidateOnTaskChange(queryClient);
    },
  });
}
