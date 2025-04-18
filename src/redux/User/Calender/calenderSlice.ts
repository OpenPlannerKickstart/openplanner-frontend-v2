import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalenderInitializeState {
    calendarData: any;
    syllabusData: any;
    loading: boolean;
}

const initialState: CalenderInitializeState = {
    calendarData: null,
    syllabusData: null,
    loading: false,
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        getCalendarDataSuccess: (
            state: CalenderInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.calendarData = action.payload;
            state.loading = false;

        },
        getCalendarDataFailure: (state) => {
            state.calendarData = null;
            state.loading = false;

        },

        getSyllabusSuccess: (
            state: CalenderInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.syllabusData = action.payload;
            state.loading = false;

        },
        getSyllabusFailure: (state) => {
            state.calendarData = null;
            state.loading = false;

        },
    },
});

export const {
    getCalendarDataSuccess,
    getCalendarDataFailure,
} = calendarSlice.actions;

export default calendarSlice.reducer;
