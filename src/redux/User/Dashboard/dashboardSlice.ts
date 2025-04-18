import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardInitializeState {
    listingCount: any;
    coursesData: any;
    tasksData: any;
    eventsData: any;
    eventListing: any;
    syllabusDropDown: any;
    deleteEvent: any;
    updateStatus: any;
    loading: boolean;
}

const initialState: DashboardInitializeState = {
    listingCount: null,
    coursesData: null,
    tasksData: null,
    eventsData: null,
    eventListing: null,
    syllabusDropDown: null,
    deleteEvent: null,
    updateStatus: null,
    loading: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        dashboardListingCountSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.listingCount = action.payload;
            state.loading = false;
        },
        dashboardListingCountFailure: (state) => {
            state.listingCount = null;
            state.loading = false;
        },

        dashboardCoursesDataSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.coursesData = action.payload;
            state.loading = false;
        },
        dashboardCoursesDataFailure: (state) => {
            state.coursesData = null;
            state.loading = false;
        },

        dashboardTasksDataSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.tasksData = action.payload;
            state.loading = false;
        },
        dashboardTasksDataFailure: (state) => {
            state.tasksData = null;
            state.loading = false;
        },

        dashboardEventsDataSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.eventsData = action.payload;
            state.loading = false;
        },
        dashboardEventsDataFailure: (state) => {
            state.eventsData = null;
            state.loading = false;
        },

        dashboardEventListingSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.eventListing = action.payload;
            state.loading = false;
        },
        dashboardEventListingFailure: (state) => {
            state.eventListing = null;
            state.loading = false;
        },

        getSyllabusDropDownSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.syllabusDropDown = action.payload;
            state.loading = false;
        },
        getSyllabusDropDownFailure: (state) => {
            state.syllabusDropDown = null;
            state.loading = false;
        },

        deleteEventSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.deleteEvent = action.payload;
            state.loading = false;
        },
        deleteEventFailure: (state) => {
            state.deleteEvent = null;
            state.loading = false;
        },

        updateEventStatusSuccess: (
            state: DashboardInitializeState,
            action: PayloadAction<any>
        ) => {
            state.updateStatus = action.payload;
            state.loading = false;
        },
        updateEventStatusFailure: (state) => {
            state.updateStatus = null;
            state.loading = false;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    dashboardListingCountSuccess,
    dashboardListingCountFailure,
    dashboardCoursesDataSuccess,
    dashboardCoursesDataFailure,
    dashboardTasksDataSuccess,
    dashboardTasksDataFailure,
    dashboardEventsDataSuccess,
    dashboardEventsDataFailure,
    dashboardEventListingSuccess,
    dashboardEventListingFailure,
    getSyllabusDropDownSuccess,
    getSyllabusDropDownFailure,
    updateEventStatusFailure,
    updateEventStatusSuccess,
    deleteEventFailure,
    deleteEventSuccess,
    setLoading,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
