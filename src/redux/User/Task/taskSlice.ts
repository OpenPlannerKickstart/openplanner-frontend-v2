import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskInitializeState {
    addEditTaskData: any;
    taskList: any;
    updateStatusData: any;
    updateStarData: any;
    deleteTaskData: any;
    loading: boolean;
}

const initialState: TaskInitializeState = {
    addEditTaskData: null,
    taskList: null,
    updateStatusData: null,
    updateStarData: null,
    deleteTaskData: null,
    loading: false,
};

const taskSlice: any = createSlice({
    name: "task",
    initialState,
    reducers: {
        addEditTaskSuccess: (
            state: TaskInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.addEditTaskData = action.payload;
            state.loading = false;
        },
        addEditTaskFailure: (state) => {
            state.addEditTaskData = null;
            state.loading = false;
        },

        getTaskListSuccess: (
            state: TaskInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.taskList = action.payload;
            state.loading = false;
        },
        getTaskListFailure: (state) => {
            state.taskList = null;
            state.loading = false;
        },

        updateStatusSuccess: (
            state: TaskInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.updateStatusData = action.payload;
            state.loading = false;
        },
        updateStatusFailure: (state) => {
            state.updateStatusData = null;
            state.loading = false;
        },

        updateStarSuccess: (
            state: TaskInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.updateStarData = action.payload;
            state.loading = false;
        },
        updateStarFailure: (state) => {
            state.updateStarData = null;
            state.loading = false;
        },

        deleteTaskSuccess: (
            state: TaskInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.deleteTaskData = action.payload;
            state.loading = false;
        },
        deleteTaskFailure: (state) => {
            state.deleteTaskData = null;
            state.loading = false;
        },
    },
});

export const { addEditTaskSuccess, addEditTaskFailure,
    getTaskListSuccess, getTaskListFailure,
    updateStatusSuccess, updateStatusFailure,
    updateStarSuccess, updateStarFailure,
    deleteTaskSuccess, deleteTaskFailure
} = taskSlice.actions;
export default taskSlice?.reducer;