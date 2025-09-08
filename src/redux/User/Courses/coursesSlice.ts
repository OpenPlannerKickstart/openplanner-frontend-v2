import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CoursesInitializeState {
    getCoursesListData: any;
    getEventListData: any;
    addEditSyllabusData: any;
    isUpdatedSyllabusData: any;
    addEditEventData: any;
    isUpdatedEventData: any;
    deleteEventData: any;
    deleteSyllabusData: any;
    updateSyllabusStatusData: any;
    updateEventStatusData: any;
    getSyllabusDropDownData: any;
    completesyllabusData: any;

    loading: boolean;
}

const initialState: CoursesInitializeState = {
    getCoursesListData: null,
    addEditEventData: null,
    isUpdatedEventData: false,
    addEditSyllabusData: null,
    isUpdatedSyllabusData: false,
    deleteEventData: null,
    deleteSyllabusData: null,
    updateEventStatusData: null,
    updateSyllabusStatusData: null,
    getEventListData: null,
    getSyllabusDropDownData: null,
    completesyllabusData: null,
    loading: false,
};

const CoursesSlice: any = createSlice({
    name: "coursesRedux",
    initialState,
    reducers: {
        getCoursesListDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.getCoursesListData = action.payload;
            state.loading = false;
        },
        getCoursesListDataFailure: (state) => {
            state.getCoursesListData = null;
            state.loading = false;
        },
        getEventListDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.getEventListData = action.payload;
            state.loading = false;
        },
        getEventListDataFailure: (state) => {
            state.getEventListData = null;
            state.loading = false;
        },
        addEditSyllabusDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.addEditSyllabusData = action.payload;
            state.loading = false;
        },
        addEditSyllabusDataFailure: (state) => {
            state.addEditSyllabusData = null;
            state.loading = false;
        },
        isUpdatedSyllabus: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.isUpdatedSyllabusData = action.payload;
            state.loading = false;
        },
        addEditEventDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.addEditEventData = action.payload;
            state.loading = false;
        },
        addEditEventDataFailure: (state) => {
            state.addEditEventData = null;
            state.loading = false;
        },
        isUpdatedEvent: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.isUpdatedEventData = action.payload;
            state.loading = false;
        },
        deleteSyllabusDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.deleteSyllabusData = action.payload;
            state.loading = false;
        },
        deleteSyllabusDataFailure: (state) => {
            state.deleteSyllabusData = null;
            state.loading = false;
        },
        deleteEventDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.deleteEventData = action.payload;
            state.loading = false;
        },
        deleteEventDataFailure: (state) => {
            state.deleteEventData = null;
            state.loading = false;
        },
        updateEventStatusDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.updateEventStatusData = action.payload;
            state.loading = false;
        },
        updateEventStatusDataFailure: (state) => {
            state.updateEventStatusData = null;
            state.loading = false;
        },
        updateSyllabusStatusDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.updateSyllabusStatusData = action.payload;
            state.loading = false;
        },
        updateSyllabusStatusDataFailure: (state) => {
            state.updateSyllabusStatusData = null;
            state.loading = false;
        },
        getSyllabusDropDownDataSuccess: (
            state: CoursesInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.getSyllabusDropDownData = action.payload;
            state.loading = false;
        },
        getSyllabusDropDownDataFailure: (state) => {
            state.getSyllabusDropDownData = null;
            state.loading = false;
        },




    },
});

export const { getCoursesListDataSuccess,
    getCoursesListDataFailure,
    getEventListDataSuccess,
    getEventListDataFailure,
    addEditSyllabusDataSuccess,
    addEditSyllabusDataFailure,
    addEditEventDataSuccess,
    addEditEventDataFailure,
    updateEventStatusDataSuccess,
    updateEventStatusDataFailure,
    updateSyllabusStatusDataSuccess,
    updateSyllabusStatusDataFailure,
    getSyllabusDropDownDataSuccess,
    getSyllabusDropDownDataFailure,
    deleteEventDataFailure,
    deleteEventDataSuccess,
    deleteSyllabusDataFailure,
    deleteSyllabusDataSuccess,
    isUpdatedSyllabus,
    isUpdatedEvent


} = CoursesSlice.actions;
export default CoursesSlice?.reducer;