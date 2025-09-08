import { ENUM_FOR_EVENT_PRIORITY } from "../interfaces/enum";

export const reminderUnitDropDownData =
    [
        { value: "hours", label: "Hours" },
        { value: "days", label: "Days" },
    ] as const;


export const chartDropDownData =
    [
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "year", label: "This Year" },

    ] as const;

    export const eventPriorityDropDownData=[
        {value:ENUM_FOR_EVENT_PRIORITY.HIGH,label:ENUM_FOR_EVENT_PRIORITY.HIGH},
        {value:ENUM_FOR_EVENT_PRIORITY.MEDIUM,label:ENUM_FOR_EVENT_PRIORITY.MEDIUM},
        {value:ENUM_FOR_EVENT_PRIORITY.LOW,label:ENUM_FOR_EVENT_PRIORITY.LOW},

    ]