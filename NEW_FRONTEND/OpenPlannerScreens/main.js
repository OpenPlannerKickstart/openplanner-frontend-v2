// ============================================
// Open Planner - Dashboard JavaScript
// ============================================

// Global events data - accessible across all functions
let globalEvents = [
    {
        id: 1,
        title: 'Team Meeting',
        date: new Date(2025, 11, 10, 9, 0),
        endDate: new Date(2025, 11, 10, 10, 0),
        calendar: 'analytics',
        color: 'yellow',
        priority: 'High',
        completed: false
    },
    {
        id: 2,
        title: 'Project Review',
        date: new Date(2025, 11, 10, 14, 0),
        endDate: new Date(2025, 11, 10, 15, 30),
        calendar: 'finance',
        color: 'green',
        priority: 'Medium',
        completed: false
    },
    {
        id: 3,
        title: 'Client Call',
        date: new Date(2025, 11, 11, 11, 0),
        endDate: new Date(2025, 11, 11, 12, 0),
        calendar: 'marketing',
        color: 'teal',
        priority: 'High',
        completed: false
    },
    {
        id: 4,
        title: 'Study Session',
        date: new Date(2025, 11, 12, 10, 0),
        endDate: new Date(2025, 11, 12, 11, 30),
        calendar: 'history',
        color: 'lime',
        priority: 'Low',
        completed: false
    },
    {
        id: 5,
        title: 'Lunch with Team',
        date: new Date(2025, 11, 12, 12, 30),
        endDate: new Date(2025, 11, 12, 13, 30),
        calendar: 'accounting',
        color: 'orange',
        priority: 'Low',
        completed: false
    },
    {
        id: 6,
        title: 'Budget Planning',
        date: new Date(2025, 11, 13, 9, 0),
        endDate: new Date(2025, 11, 13, 10, 30),
        calendar: 'finance',
        color: 'green',
        priority: 'High',
        completed: false
    },
    {
        id: 7,
        title: 'Marketing Review',
        date: new Date(2025, 11, 15, 14, 0),
        endDate: new Date(2025, 11, 15, 15, 0),
        calendar: 'marketing',
        color: 'teal',
        priority: 'Medium',
        completed: false
    },
    {
        id: 8,
        title: 'Analytics Workshop',
        date: new Date(2025, 11, 17, 10, 0),
        endDate: new Date(2025, 11, 17, 12, 0),
        calendar: 'analytics',
        color: 'yellow',
        priority: 'High',
        completed: false
    },
    {
        id: 9,
        title: 'Quarterly Report',
        date: new Date(2025, 11, 18, 9, 0),
        endDate: new Date(2025, 11, 18, 11, 0),
        calendar: 'accounting',
        color: 'orange',
        priority: 'High',
        completed: false
    },
    {
        id: 10,
        title: 'History Exam',
        date: new Date(2025, 11, 20, 13, 0),
        endDate: new Date(2025, 11, 20, 15, 0),
        calendar: 'history',
        color: 'lime',
        priority: 'High',
        completed: false
    },
    // Dashboard/My Week events
    {
        id: 11,
        title: 'Topic: Boris and competitive conversion\nReadings: SHMA 152-174',
        date: new Date(2025, 11, 7, 12, 30),
        endDate: new Date(2025, 11, 7, 13, 0),
        calendar: 'analytics',
        color: 'yellow',
        priority: 'Low',
        completed: false
    },
    {
        id: 12,
        title: 'Topic: Western Fragmentation\nReadings: SHMA 177-218; Brown Ch.20',
        date: new Date(2025, 11, 12, 12, 30),
        endDate: new Date(2025, 11, 12, 13, 0),
        calendar: 'analytics',
        color: 'yellow',
        priority: 'Low',
        completed: false
    },
    // Task List page events
    {
        id: 13,
        title: 'Complete Chapter 5 Summary',
        note: 'Summarize key concepts from Chapter 5 of the textbook. Include diagrams.',
        date: new Date(2025, 11, 14, 9, 0),
        endDate: new Date(2025, 11, 14, 11, 0),
        calendar: 'history',
        color: 'lime',
        priority: 'High',
        completed: false
    },
    {
        id: 14,
        title: 'Submit Financial Report',
        note: 'Final quarterly financial report due. Review all figures before submission.',
        date: new Date(2025, 11, 15, 14, 0),
        endDate: new Date(2025, 11, 15, 16, 0),
        calendar: 'finance',
        color: 'green',
        priority: 'High',
        completed: false
    },
    {
        id: 15,
        title: 'Marketing Campaign Review',
        note: 'Review Q4 marketing campaign metrics and prepare presentation.',
        date: new Date(2025, 11, 16, 10, 0),
        endDate: new Date(2025, 11, 16, 12, 0),
        calendar: 'marketing',
        color: 'teal',
        priority: 'Medium',
        completed: false
    },
    {
        id: 16,
        title: 'Data Analysis Assignment',
        note: 'Complete data analysis using Python. Submit Jupyter notebook.',
        date: new Date(2025, 11, 17, 13, 0),
        endDate: new Date(2025, 11, 17, 15, 0),
        calendar: 'analytics',
        color: 'yellow',
        priority: 'Medium',
        completed: false
    },
    {
        id: 17,
        title: 'Accounting Midterm Prep',
        note: 'Study chapters 1-6 for upcoming midterm examination.',
        date: new Date(2025, 11, 18, 9, 0),
        endDate: new Date(2025, 11, 18, 12, 0),
        calendar: 'accounting',
        color: 'orange',
        priority: 'High',
        completed: false
    },
    {
        id: 18,
        title: 'Group Project Meeting',
        note: 'Weekly sync with team to discuss project progress and blockers.',
        date: new Date(2025, 11, 19, 15, 0),
        endDate: new Date(2025, 11, 19, 16, 30),
        calendar: 'marketing',
        color: 'teal',
        priority: 'Low',
        completed: false
    },
    // History 112 Course Events (Edit Course page)
    {
        id: 100,
        title: 'Topic: Introduction to Late Antiquity',
        note: 'Topic: Introduction to Late Antiquity\n\nOverview of the course and key themes.',
        date: new Date(2025, 11, 5, 10, 0),
        endDate: new Date(2025, 11, 5, 11, 30),
        calendar: 'history',
        color: 'lime',
        priority: 'Medium',
        completed: true
    },
    {
        id: 101,
        title: 'Topic: Western Fragmentation Readings: SHMA 177-218; Brown Ch.20',
        note: 'Topic: Western Fragmentation\n\nReadings: SHMA 177-218; Brown Ch.20',
        date: new Date(2025, 11, 12, 12, 30),
        endDate: new Date(2025, 11, 12, 13, 0),
        calendar: 'history',
        color: 'lime',
        priority: 'Low',
        completed: false
    },
    {
        id: 102,
        title: 'Topic: Continuities and Divergences Assignments & Quizzes: Quiz 6',
        note: 'Topic: Continuities and Divergences\n\nAssignments & Quizzes: Quiz 6',
        date: new Date(2025, 11, 14, 12, 30),
        endDate: new Date(2025, 11, 14, 13, 0),
        calendar: 'history',
        color: 'lime',
        priority: 'Low',
        completed: false
    }
];

// ============================================
// LocalStorage Persistence
// ============================================

const STORAGE_KEY = 'openPlannerEvents';

// Default events (used when no saved data exists)
const defaultEvents = [...globalEvents];

// Save events to localStorage
function saveEventsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(globalEvents));
        console.log('Events saved to localStorage');
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load events from localStorage
function loadEventsFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            globalEvents = parsed.map(event => ({
                ...event,
                date: new Date(event.date),
                endDate: new Date(event.endDate)
            }));
            console.log('Events loaded from localStorage:', globalEvents.length, 'events');
        } else {
            console.log('No saved events found, using defaults');
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        // Keep default events if loading fails
    }
}

// Clear saved events and reset to defaults
function resetEventsToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    globalEvents = [...defaultEvents];
    console.log('Events reset to defaults');
}

// Load saved events on startup
loadEventsFromStorage();

// ============================================
// Course Details Storage
// ============================================
const COURSE_STORAGE_KEY = 'openPlannerCourses';

// Default course details
const defaultCourseDetails = {
    'analytics': {
        title: 'Analytics 301 - Data Analysis Fundamentals',
        professor: 'Dr. Sarah Johnson',
        classTime: 'MWF 10:00 AM - 11:15 AM',
        syllabus: 'Analytics_Syllabus.pdf',
        colorHex: '#EAB308',
        colorName: 'Yellow',
        colorClass: 'yellow'
    },
    'marketing': {
        title: 'Marketing 250 - Digital Marketing Strategy',
        professor: 'Prof. Michael Chen',
        classTime: 'TTh 2:00 PM - 3:30 PM',
        syllabus: 'Marketing_Syllabus.pdf',
        colorHex: '#14B8A6',
        colorName: 'Teal',
        colorClass: 'teal'
    },
    'finance': {
        title: 'Finance 320 - Corporate Finance',
        professor: 'Dr. Amanda Williams',
        classTime: 'MWF 1:00 PM - 2:15 PM',
        syllabus: 'Finance_Syllabus.pdf',
        colorHex: '#22C55E',
        colorName: 'Green',
        colorClass: 'green'
    },
    'history': {
        title: 'History 112 - The World of Late Antiquity, 200-900 C.E.',
        professor: 'Leonora Neville',
        classTime: 'Tuesdays 1:15 PM - 2:30 PM',
        syllabus: 'History_Syllabus.pdf',
        colorHex: '#cddc39',
        colorName: 'Lime',
        colorClass: 'lime'
    },
    'accounting': {
        title: 'Accounting 201 - Financial Accounting',
        professor: 'Dr. Robert Miller',
        classTime: 'TTh 9:00 AM - 10:30 AM',
        syllabus: 'Accounting_Syllabus.pdf',
        colorHex: '#F97316',
        colorName: 'Orange',
        colorClass: 'orange'
    }
};

// Global course details object
let globalCourseDetails = JSON.parse(JSON.stringify(defaultCourseDetails));

// Color hex to class mapping
const colorHexToClass = {
    '#239BC2': 'cyan',
    '#EF4444': 'red',
    '#F97316': 'orange',
    '#EAB308': 'yellow',
    '#22C55E': 'green',
    '#14B8A6': 'teal',
    '#3B82F6': 'blue',
    '#8B5CF6': 'purple',
    '#EC4899': 'pink',
    '#6B7280': 'gray',
    '#78716C': 'stone',
    '#6366F1': 'indigo',
    '#cddc39': 'lime'
};

// Save course details to localStorage
function saveCourseDetailsToStorage() {
    try {
        localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(globalCourseDetails));
        console.log('Course details saved to localStorage');
    } catch (e) {
        console.error('Error saving course details to localStorage:', e);
    }
}

// Load course details from localStorage
function loadCourseDetailsFromStorage() {
    try {
        const stored = localStorage.getItem(COURSE_STORAGE_KEY);
        if (stored) {
            globalCourseDetails = JSON.parse(stored);
            console.log('Course details loaded from localStorage');
        } else {
            console.log('No saved course details found, using defaults');
        }
    } catch (e) {
        console.error('Error loading course details from localStorage:', e);
    }
}

// Get course color class by course name
function getCourseColorClass(courseName) {
    const course = globalCourseDetails[courseName];
    return course ? course.colorClass : 'yellow';
}

// Get course color hex by course name
function getCourseColorHex(courseName) {
    const course = globalCourseDetails[courseName];
    return course ? course.colorHex : '#EAB308';
}

// Update course details
function updateCourseDetails(courseName, details) {
    if (globalCourseDetails[courseName]) {
        globalCourseDetails[courseName] = { ...globalCourseDetails[courseName], ...details };
        saveCourseDetailsToStorage();
        // Dispatch event to notify other components
        document.dispatchEvent(new CustomEvent('courseDetailsUpdated', { detail: { courseName, details: globalCourseDetails[courseName] } }));
    }
}

// Load course details on startup
loadCourseDetailsFromStorage();

// Map calendar names to colors (dynamically based on stored course details)
function getCalendarToColor() {
    const mapping = {};
    for (const [courseName, details] of Object.entries(globalCourseDetails)) {
        mapping[courseName] = details.colorClass;
    }
    return mapping;
}

const calendarToColor = {
    'analytics': 'yellow',
    'accounting': 'orange',
    'history': 'lime',
    'finance': 'green',
    'marketing': 'teal'
};

// Sync UI with saved data (for pages with hardcoded HTML)
function syncUIWithSavedData() {
    // Sync task rows on dashboard and task list pages
    const taskRows = document.querySelectorAll('.task-row[data-event-id], .task-item[data-event-id]');
    
    taskRows.forEach(row => {
        const eventId = parseInt(row.dataset.eventId);
        const event = globalEvents.find(ev => ev.id === eventId);
        if (event) {
            // Sync completed status
            if (event.completed) {
                row.classList.add('completed');
            } else {
                row.classList.remove('completed');
            }
            
            // Sync priority badge (dashboard)
            const priorityBadge = row.querySelector('.priority-badge');
            if (priorityBadge && event.priority) {
                priorityBadge.classList.remove('low', 'medium', 'high');
                const priorityClass = event.priority.toLowerCase();
                priorityBadge.classList.add(priorityClass);
                priorityBadge.textContent = event.priority.charAt(0).toUpperCase() + event.priority.slice(1).toLowerCase();
            }
            
            // Sync task name (task list page)
            const taskName = row.querySelector('.task-name');
            if (taskName && event.title) {
                taskName.textContent = event.title;
            }
            
            // Sync task due date (task list page)
            const taskDue = row.querySelector('.task-due');
            if (taskDue && event.date) {
                const dateStr = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                taskDue.textContent = dateStr;
            }
            
            // Sync task title in dashboard task description (col-event)
            const taskDesc = row.querySelector('.task-desc, .col-event');
            if (taskDesc && event.title) {
                taskDesc.textContent = event.title;
            }
            
            // Sync time display (dashboard)
            const timeSpan = row.querySelector('.col-time span');
            if (timeSpan && event.date && event.endDate) {
                const startTime = formatTimeOnly(event.date);
                const endTime = formatTimeOnly(event.endDate);
                timeSpan.textContent = `${startTime} - ${endTime}`;
            }
            
            // Sync course/calendar name display (dashboard)
            const courseCol = row.querySelector('.col-course');
            if (courseCol && event.calendar) {
                courseCol.textContent = event.calendar.charAt(0).toUpperCase() + event.calendar.slice(1);
            }
            
            // Sync time indicator color (dashboard)
            const timeIndicator = row.querySelector('.time-indicator');
            if (timeIndicator && event.calendar) {
                // Remove existing color classes
                timeIndicator.classList.remove('yellow', 'orange', 'blue', 'teal', 'green', 'lime');
                // Add new color class based on calendar
                const colorClass = calendarToColor[event.calendar.toLowerCase()] || 'yellow';
                timeIndicator.classList.add(colorClass);
            }
            
            // Sync task color indicator (task list page)
            const colorIndicator = row.querySelector('.task-color-indicator');
            if (colorIndicator && event.calendar) {
                colorIndicator.classList.remove('yellow', 'orange', 'blue', 'teal', 'green', 'lime');
                const colorClass = calendarToColor[event.calendar.toLowerCase()] || 'yellow';
                colorIndicator.classList.add(colorClass);
            }
            
            // Sync data attributes for modal population
            if (event.title) row.dataset.title = event.title;
            if (event.note !== undefined) row.dataset.note = event.note || '';
            if (event.priority) row.dataset.priority = event.priority.toLowerCase();
            if (event.calendar) row.dataset.calendar = event.calendar;
            if (event.date) {
                const startStr = formatDateForDisplay(event.date);
                row.dataset.start = startStr;
            }
            if (event.endDate) {
                const endStr = formatDateForDisplay(event.endDate);
                row.dataset.end = endStr;
            }
        }
    });
    
    // Sync event chips on calendar
    const eventChips = document.querySelectorAll('.event-chip[data-event-id]');
    eventChips.forEach(chip => {
        const eventId = parseInt(chip.dataset.eventId);
        const event = globalEvents.find(ev => ev.id === eventId);
        if (event) {
            if (event.completed) {
                chip.classList.add('completed');
            } else {
                chip.classList.remove('completed');
            }
            // Update chip text if needed
            if (event.title) {
                const titleParts = event.title.split('\n');
                chip.textContent = titleParts[0]; // Use first line as chip text
            }
        }
    });
}

// Helper to format time only (e.g., "12:30 PM")
function formatTimeOnly(date) {
    if (!date) return '';
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

// Helper to format date for display
function formatDateForDisplay(date) {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

// Debug function to check localStorage content
function debugLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const events = JSON.parse(stored);
        console.log('=== LocalStorage Debug ===');
        console.log('Total events in storage:', events.length);
        console.log('Completed events in storage:', events.filter(e => e.completed).map(e => ({ id: e.id, title: e.title })));
    } else {
        console.log('No data in localStorage');
    }
}

// Make debug function available globally
window.debugLocalStorage = debugLocalStorage;

// Run sync after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Render dashboard events if on dashboard page
    renderDashboardEvents();
    
    syncUIWithSavedData();
    
    // Trigger calendar view refresh if on calendar page
    const calendarViewContainer = document.querySelector('.calendar-view-container');
    if (calendarViewContainer) {
        const refreshEvent = new CustomEvent('refreshCalendarViews');
        document.dispatchEvent(refreshEvent);
    }
});

// ============================================
// Dynamic Dashboard Events Rendering
// ============================================

function renderDashboardEvents() {
    const container = document.getElementById('dashboardEventsContainer');
    if (!container) return; // Not on dashboard page
    
    // Get current week range from the date navigator
    const weekRange = getWeekRange();
    
    // Filter events for the current week
    const weekEvents = globalEvents.filter(event => {
        const eventDate = event.date;
        return eventDate >= weekRange.start && eventDate <= weekRange.end;
    });
    
    // Sort events by date
    weekEvents.sort((a, b) => a.date - b.date);
    
    // Group events by date
    const eventsByDate = {};
    weekEvents.forEach(event => {
        const dateKey = event.date.toDateString();
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Render each date group
    Object.keys(eventsByDate).forEach(dateKey => {
        const events = eventsByDate[dateKey];
        const dateObj = new Date(dateKey);
        
        // Create date group
        const dateGroup = document.createElement('div');
        dateGroup.className = 'due-date-group';
        
        // Format date header
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        
        dateGroup.innerHTML = `<h3 class="due-date-header">Due on ${dayName}, ${monthDay}</h3>`;
        
        // Render each event in this date group
        events.forEach(event => {
            const taskRow = createDashboardTaskRow(event);
            dateGroup.appendChild(taskRow);
        });
        
        container.appendChild(dateGroup);
    });
    
    // Show message if no events
    if (weekEvents.length === 0) {
        container.innerHTML = `
            <div class="no-events-message" style="padding: 2rem; text-align: center; color: var(--neutral-500);">
                <p>No events scheduled for this week.</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Click "Add Event" to create one.</p>
            </div>
        `;
    }
}

function createDashboardTaskRow(event) {
    const row = document.createElement('div');
    row.className = `task-row clickable-event${event.completed ? ' completed' : ''}`;
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.dataset.eventId = event.id;
    row.dataset.start = formatDateForDisplay(event.date);
    row.dataset.end = formatDateForDisplay(event.endDate);
    row.dataset.title = event.title || '';
    row.dataset.note = event.note || '';
    row.dataset.calendar = event.calendar || 'analytics';
    row.dataset.priority = (event.priority || 'low').toLowerCase();
    
    const startTime = formatTimeOnly(event.date);
    const endTime = formatTimeOnly(event.endDate);
    const colorClass = calendarToColor[event.calendar?.toLowerCase()] || 'yellow';
    const priorityClass = (event.priority || 'low').toLowerCase();
    const priorityText = (event.priority || 'Low').charAt(0).toUpperCase() + (event.priority || 'Low').slice(1).toLowerCase();
    const calendarText = (event.calendar || 'Analytics').charAt(0).toUpperCase() + (event.calendar || 'Analytics').slice(1);
    
    row.innerHTML = `
        <div class="col-actions">
            <button class="task-checkbox">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </button>
        </div>
        <div class="col-time">
            <div class="time-indicator ${colorClass}"></div>
            <span>${startTime} - ${endTime}</span>
        </div>
        <div class="col-priority">
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
        </div>
        <div class="col-course">${calendarText}</div>
        <div class="col-event">${event.title || 'Untitled Event'}</div>
        <div class="col-delete">
            <button class="delete-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </button>
        </div>
    `;
    
    return row;
}

// Global variable to track the current week being displayed on dashboard
let dashboardWeekStart = new Date(2025, 11, 7); // Dec 07, 2025 (default)
dashboardWeekStart.setHours(0, 0, 0, 0);

function getWeekRange() {
    // Use the global dashboardWeekStart
    const start = new Date(dashboardWeekStart);
    start.setHours(0, 0, 0, 0);
    
    // End of week (Saturday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
}

// Function to update dashboard week and re-render events
function setDashboardWeek(startDate) {
    dashboardWeekStart = new Date(startDate);
    dashboardWeekStart.setHours(0, 0, 0, 0);
    renderDashboardEvents();
}

// Helper function to parse date strings (MM/DD/YYYY hh:mm AM/PM format)
function parseDateString(str) {
    if (!str) return null;
    const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?\s*(AM|PM)?/i);
    if (match) {
        const [, month, day, year, hours, minutes, ampm] = match;
        const date = new Date(year, month - 1, day);
        
        if (hours) {
            let h = parseInt(hours);
            if (ampm && ampm.toUpperCase() === 'PM' && h < 12) h += 12;
            if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
            date.setHours(h);
            date.setMinutes(parseInt(minutes) || 0);
        }
        
        return date;
    }
    return null;
}

// Current event ID being viewed in modal
let currentEventId = null;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initTaskCheckboxes();
    initDateNavigation();
    initEventModal();
    initAddEventModal();
    initCalendarViews();
    initCourseFilters();
});

// ============================================
// Course Filter Pills
// ============================================

function initCourseFilters() {
    const coursePills = document.querySelectorAll('.course-pill');
    const taskGroups = document.querySelectorAll('.task-group');
    
    if (coursePills.length === 0) return;
    
    // Map pill colors to calendar names
    const colorToCalendar = {
        'orange': 'accounting',
        'yellow': 'history',
        'green': 'finance',
        'teal': 'marketing',
        'gold': 'analytics'
    };
    
    let activeFilter = null;
    
    coursePills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Get the calendar name from the pill's color class
            const pillClasses = pill.classList;
            let calendarName = null;
            
            for (const [color, calendar] of Object.entries(colorToCalendar)) {
                if (pillClasses.contains(color)) {
                    calendarName = calendar;
                    break;
                }
            }
            
            // Toggle filter: if same pill clicked, clear filter
            if (activeFilter === calendarName) {
                activeFilter = null;
                pill.classList.remove('active');
                // Show all tasks
                showAllTasks();
            } else {
                // Remove active class from all pills
                coursePills.forEach(p => p.classList.remove('active'));
                // Add active class to clicked pill
                pill.classList.add('active');
                activeFilter = calendarName;
                // Filter tasks
                filterTasksByCalendar(calendarName);
            }
        });
    });
    
    function filterTasksByCalendar(calendarName) {
        const taskRows = document.querySelectorAll('.task-row[data-calendar]');
        
        taskRows.forEach(row => {
            const rowCalendar = row.dataset.calendar?.toLowerCase();
            if (rowCalendar === calendarName) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Also hide/show task group headers if all tasks in that group are hidden
        taskGroups.forEach(group => {
            const visibleTasks = group.querySelectorAll('.task-row[data-calendar]:not([style*="display: none"])');
            const groupHeader = group.querySelector('.task-group-header, .task-date-header');
            if (groupHeader) {
                if (visibleTasks.length === 0) {
                    group.style.display = 'none';
                } else {
                    group.style.display = '';
                }
            }
        });
    }
    
    function showAllTasks() {
        const taskRows = document.querySelectorAll('.task-row[data-calendar]');
        taskRows.forEach(row => {
            row.style.display = '';
        });
        
        // Show all task groups
        taskGroups.forEach(group => {
            group.style.display = '';
        });
    }
}

// ============================================
// Sidebar Toggle
// ============================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarToggle = document.getElementById('sidebarToggle');

    // Restore collapsed state from localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Sidebar collapse toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const collapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
        });
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Close sidebar on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
}

// ============================================
// Task Checkboxes
// ============================================

function initTaskCheckboxes() {
    // Only handle checkboxes in .task-row elements (dashboard)
    // .task-item checkboxes are handled separately via event delegation
    const checkboxes = document.querySelectorAll('.task-row .task-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            
            // Get the parent task row
            const taskRow = checkbox.closest('.task-row');
            if (taskRow) {
                taskRow.classList.toggle('completed');
            }
        });
    });
}

// ============================================
// Date Navigation
// ============================================

function initDateNavigation() {
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const dateRange = document.querySelector('.date-range');
    const todayBtn = document.querySelector('.today-btn');

    function formatDateRange(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        const options = { month: 'short', day: '2-digit' };
        const startStr = startDate.toLocaleDateString('en-US', options);
        const endStr = endDate.toLocaleDateString('en-US', options);

        return `${startStr} - ${endStr}`;
    }

    function updateDateRange() {
        if (dateRange) {
            dateRange.textContent = formatDateRange(dashboardWeekStart);
        }
    }

    // Initialize the date range display
    updateDateRange();

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            dashboardWeekStart.setDate(dashboardWeekStart.getDate() - 7);
            updateDateRange();
            renderDashboardEvents();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            dashboardWeekStart.setDate(dashboardWeekStart.getDate() + 7);
            updateDateRange();
            renderDashboardEvents();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            const today = new Date();
            const dayOfWeek = today.getDay();
            // Set to Sunday of current week
            dashboardWeekStart = new Date(today);
            dashboardWeekStart.setDate(today.getDate() - dayOfWeek);
            dashboardWeekStart.setHours(0, 0, 0, 0);
            updateDateRange();
            renderDashboardEvents();
        });
    }
}

// ============================================
// Delete Task
// ============================================

function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const taskRow = btn.closest('.task-row');
            if (taskRow) {
                // Use custom confirmation modal if available, otherwise use native confirm
                if (typeof window.showDeleteConfirm === 'function') {
                    window.showDeleteConfirm('Delete Event', function() {
                        taskRow.style.opacity = '0';
                        taskRow.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            taskRow.remove();
                        }, 300);
                    });
                } else if (confirm('Are you sure you want to delete this event?')) {
                    taskRow.style.opacity = '0';
                    taskRow.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        taskRow.remove();
                    }, 300);
                }
            }
        });
    });
}

// ============================================
// Event Modal
// ============================================

function initEventModal() {
    const modalOverlay = document.getElementById('eventModalOverlay');
    const modalCard = document.getElementById('eventModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const editToggleBtn = document.getElementById('editToggleBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const modalFooter = document.getElementById('modalFooter');
    
    // Exit if modal doesn't exist on this page
    if (!modalOverlay) return;
    
    // Note: Event chips and clickable events are handled via event delegation below
    // to support dynamically rendered elements
    
    // Form elements (main form inputs, not including notification fields which are handled separately)
    const formInputs = [
        document.getElementById('eventStartDate'),
        document.getElementById('eventEndDate'),
        document.getElementById('eventTitle'),
        document.getElementById('eventNote')
    ];
    
    const formSelects = [
        document.getElementById('eventCalendar'),
        document.getElementById('eventPriority')
    ];
    
    const formCheckbox = document.getElementById('addToDefaultCalendar');
    
    // Add listener to update modal color when calendar/course changes in edit mode
    const calendarSelect = document.getElementById('eventCalendar');
    if (calendarSelect) {
        calendarSelect.addEventListener('change', function() {
            // Update modal border color to match new course
            setModalCalendarClass(this.value);
        });
    }
    
    let isEditMode = false;
    let originalValues = {};
    
    // Store original values for cancel functionality
    function storeOriginalValues() {
        originalValues = {
            startDate: document.getElementById('eventStartDate')?.value || '',
            endDate: document.getElementById('eventEndDate')?.value || '',
            title: document.getElementById('eventTitle')?.value || '',
            note: document.getElementById('eventNote')?.value || '',
            calendar: document.getElementById('eventCalendar')?.value || 'analytics',
            priority: document.getElementById('eventPriority')?.value || 'low',
            addToDefault: document.getElementById('addToDefaultCalendar')?.checked || false,
            notifications: []
        };
        
        // Store notification values
        const container = document.getElementById('eventNotificationsContainer');
        if (container) {
            container.querySelectorAll('.notification-row').forEach(row => {
                const unit = row.querySelector('select[name="reminderUnit"]')?.value || 'days';
                const value = row.querySelector('input[name="reminderValue"]')?.value || '1';
                originalValues.notifications.push({ unit, value });
            });
        }
    }
    
    // Restore original values on cancel
    function restoreOriginalValues() {
        const startDate = document.getElementById('eventStartDate');
        const endDate = document.getElementById('eventEndDate');
        const title = document.getElementById('eventTitle');
        const note = document.getElementById('eventNote');
        const calendar = document.getElementById('eventCalendar');
        const priority = document.getElementById('eventPriority');
        const addToDefault = document.getElementById('addToDefaultCalendar');
        
        if (startDate) startDate.value = originalValues.startDate;
        if (endDate) endDate.value = originalValues.endDate;
        if (title) title.value = originalValues.title;
        if (note) note.value = originalValues.note;
        if (calendar) calendar.value = originalValues.calendar;
        if (priority) priority.value = originalValues.priority;
        if (addToDefault) addToDefault.checked = originalValues.addToDefault;
        
        // Restore notification values
        const container = document.getElementById('eventNotificationsContainer');
        if (container && originalValues.notifications) {
            // Remove extra rows
            const rows = container.querySelectorAll('.notification-row');
            rows.forEach((row, index) => {
                if (index >= originalValues.notifications.length) {
                    row.remove();
                }
            });
            
            // Restore values for existing rows
            const remainingRows = container.querySelectorAll('.notification-row');
            remainingRows.forEach((row, index) => {
                if (originalValues.notifications[index]) {
                    const unit = row.querySelector('select[name="reminderUnit"]');
                    const value = row.querySelector('input[name="reminderValue"]');
                    if (unit) unit.value = originalValues.notifications[index].unit;
                    if (value) value.value = originalValues.notifications[index].value;
                }
            });
            
            // Update notification UI
            const count = container.querySelectorAll('.notification-row').length;
            const addBtn = document.getElementById('addEventNotificationBtn');
            if (addBtn) {
                if (count >= 3) {
                    addBtn.style.display = 'none';
                } else {
                    addBtn.style.display = 'flex';
                }
            }
            container.querySelectorAll('.notification-row').forEach((row, idx) => {
                const removeBtn = row.querySelector('.remove-notification-btn');
                if (removeBtn) {
                    removeBtn.style.display = count > 1 ? 'flex' : 'none';
                }
            });
            
            // Update count label
            const countLabel = document.getElementById('eventNotificationCount');
            if (countLabel) {
                countLabel.textContent = `${count}/3`;
            }
        }
    }
    
    // Use event delegation for all dynamically created elements
    document.addEventListener('click', (e) => {
        // Handle event chips (calendar month view)
        const chip = e.target.closest('.event-chip');
        if (chip) {
            e.stopPropagation();
            openModalFromChip(chip);
            return;
        }
        
        // Handle week view events
        const weekEvent = e.target.closest('.week-event');
        if (weekEvent) {
            e.stopPropagation();
            openModalFromChip(weekEvent);
            return;
        }
        
        // Handle day view events
        const dayEvent = e.target.closest('.day-event');
        if (dayEvent) {
            e.stopPropagation();
            openModalFromChip(dayEvent);
            return;
        }
        
        // Handle clickable event rows (dashboard/tasks page) - using event delegation
        const clickableRow = e.target.closest('.clickable-event');
        if (clickableRow) {
            // Don't open modal if clicking on checkbox, delete button, or star button
            if (e.target.closest('.task-checkbox') || e.target.closest('.delete-btn') || e.target.closest('.task-star')) {
                return;
            }
            e.stopPropagation();
            openModalFromDataAttributes(clickableRow);
            return;
        }
        
        // Handle calendar cell clicks to open Add Event modal
        const calendarCell = e.target.closest('.calendar-cell');
        if (calendarCell && !e.target.closest('.event-chip')) {
            // Only trigger if clicking on the cell itself, not on an event chip
            const dateStr = calendarCell.dataset.date;
            if (dateStr && window.openAddEventModal) {
                const clickedDate = new Date(dateStr + 'T00:00:00');
                window.openAddEventModal(clickedDate);
            }
            return;
        }
    });
    
    // Use event delegation for keyboard navigation on clickable events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const clickableRow = e.target.closest('.clickable-event');
            if (clickableRow) {
                e.preventDefault();
                openModalFromDataAttributes(clickableRow);
            }
        }
    });
    
    // Handle task checkbox clicks (mark complete directly)
    document.querySelectorAll('.task-item .task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskItem = checkbox.closest('.task-item');
            if (!taskItem) return;
            
            const eventId = taskItem.dataset.eventId;
            
            // Toggle completed state on the task item
            const isNowCompleted = taskItem.classList.toggle('completed');
            
            // Update globalEvents if the event exists
            if (eventId) {
                const event = globalEvents.find(ev => ev.id === parseInt(eventId));
                if (event) {
                    event.completed = isNowCompleted;
                    saveEventsToStorage();
                }
            }
            
            // Update task counts if on tasks page
            if (typeof window.updateTaskCounts === 'function') {
                window.updateTaskCounts();
            }
            
            // Re-apply current filter to update the view
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && typeof window.filterTasks === 'function') {
                const currentTab = activeTab.dataset.tab;
                // Animate out if task should be hidden in current view
                const shouldHide = (isNowCompleted && currentTab === 'todo') || 
                                   (!isNowCompleted && currentTab === 'completed');
                if (shouldHide) {
                    taskItem.style.transition = 'opacity 0.3s ease';
                    taskItem.style.opacity = '0';
                    setTimeout(() => {
                        window.filterTasks(currentTab);
                        taskItem.style.opacity = '';
                        taskItem.style.transition = '';
                    }, 300);
                }
            }
            
            // Trigger calendar view refresh if applicable
            const refreshEvent = new CustomEvent('refreshCalendarViews');
            document.dispatchEvent(refreshEvent);
        });
    });
    
    // Handle task star clicks (toggle importance)
    document.querySelectorAll('.task-item .task-star').forEach(star => {
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskItem = star.closest('.task-item');
            const isNowStarred = star.classList.toggle('starred');
            
            // Update task counts if on tasks page
            if (typeof window.updateTaskCounts === 'function') {
                window.updateTaskCounts();
            }
            
            // Re-apply current filter to update the view
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && typeof window.filterTasks === 'function') {
                const currentTab = activeTab.dataset.tab;
                // Animate out if task should be hidden in current view (unstarred in starred view)
                if (currentTab === 'starred' && !isNowStarred && taskItem) {
                    taskItem.style.transition = 'opacity 0.3s ease';
                    taskItem.style.opacity = '0';
                    setTimeout(() => {
                        window.filterTasks(currentTab);
                        taskItem.style.opacity = '';
                        taskItem.style.transition = '';
                    }, 300);
                }
            }
        });
    });
    
    function setModalCalendarClass(calendar) {
        // Remove any existing calendar classes
        if (modalCard) {
            modalCard.classList.remove(
                'calendar-analytics',
                'calendar-accounting', 
                'calendar-history',
                'calendar-finance',
                'calendar-marketing'
            );
            // Add the new calendar class
            if (calendar) {
                modalCard.classList.add(`calendar-${calendar}`);
            }
        }
    }
    
    function openModalFromChip(chip) {
        // Populate modal with event data based on chip
        populateModalFromChip(chip);
        
        // Get calendar from the populated select
        const calendarEl = document.getElementById('eventCalendar');
        const calendar = calendarEl ? calendarEl.value : 'analytics';
        setModalCalendarClass(calendar);
        
        // Store original values
        storeOriginalValues();
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset edit mode
        setEditMode(false);
    }
    
    function openModalFromDataAttributes(element) {
        // Populate modal with data attributes
        const eventId = element.dataset.eventId;
        const startDate = element.dataset.start || '12/07/2025 12:30 PM';
        const endDate = element.dataset.end || '12/07/2025 01:00 PM';
        const title = element.dataset.title || '';
        const note = element.dataset.note || '';
        const calendar = element.dataset.calendar || 'analytics';
        const priority = element.dataset.priority || 'low';
        
        // Set the current event ID for Mark Complete functionality
        currentEventId = eventId ? parseInt(eventId) : null;
        
        // Get the event from global events to check completed status
        const event = currentEventId ? globalEvents.find(ev => ev.id === currentEventId) : null;
        const isCompleted = event ? event.completed : false;
        
        const startDateEl = document.getElementById('eventStartDate');
        const endDateEl = document.getElementById('eventEndDate');
        const titleEl = document.getElementById('eventTitle');
        const noteEl = document.getElementById('eventNote');
        const calendarEl = document.getElementById('eventCalendar');
        const priorityEl = document.getElementById('eventPriority');
        
        if (startDateEl) startDateEl.value = startDate;
        if (endDateEl) endDateEl.value = endDate;
        if (titleEl) titleEl.value = title.replace(/&#10;/g, '\n');
        if (noteEl) noteEl.value = note.replace(/&#10;/g, '\n');
        if (calendarEl) calendarEl.value = calendar;
        if (priorityEl) priorityEl.value = priority;
        
        // Update Mark Complete button based on event's completed status
        updateMarkCompleteButtonState(isCompleted);
        
        // Update modal card completed styling
        if (modalCard) {
            if (isCompleted) {
                modalCard.classList.add('completed');
            } else {
                modalCard.classList.remove('completed');
            }
        }
        
        // Set modal border color based on calendar
        setModalCalendarClass(calendar);
        
        // Store original values
        storeOriginalValues();
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset edit mode
        setEditMode(false);
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset edit mode
        setEditMode(false);
    }
    
    function setEditMode(enabled) {
        isEditMode = enabled;
        
        if (modalCard) {
            modalCard.classList.toggle('edit-mode', enabled);
        }
        
        if (editToggleBtn) {
            editToggleBtn.classList.toggle('active', enabled);
            const span = editToggleBtn.querySelector('span');
            if (span) span.textContent = enabled ? 'Editing' : 'Edit';
        }
        
        // Toggle input states
        formInputs.forEach(input => {
            if (input) {
                input.readOnly = !enabled;
            }
        });
        
        formSelects.forEach(select => {
            if (select) {
                select.disabled = !enabled;
            }
        });
        
        if (formCheckbox) {
            formCheckbox.disabled = !enabled;
        }
        
        // Handle multi-notification controls in event modal
        const eventNotificationsContainer = document.getElementById('eventNotificationsContainer');
        const addEventNotificationBtn = document.getElementById('addEventNotificationBtn');
        
        if (eventNotificationsContainer) {
            // Enable/disable all notification inputs and selects
            eventNotificationsContainer.querySelectorAll('input, select').forEach(el => {
                if (el.tagName === 'INPUT') {
                    el.readOnly = !enabled;
                } else {
                    el.disabled = !enabled;
                }
            });
            
            // Enable/disable remove buttons
            eventNotificationsContainer.querySelectorAll('.remove-notification-btn').forEach(btn => {
                btn.disabled = !enabled;
            });
        }
        
        // Show/hide add notification button
        if (addEventNotificationBtn) {
            addEventNotificationBtn.style.display = enabled ? 'flex' : 'none';
            addEventNotificationBtn.disabled = !enabled;
        }
        
        // Show/hide footer buttons
        if (cancelEditBtn) {
            cancelEditBtn.style.display = enabled ? 'inline-flex' : 'none';
        }
        if (saveEventBtn) {
            saveEventBtn.style.display = enabled ? 'inline-flex' : 'none';
        }
    }
    
    function populateModalFromChip(chip) {
        // Check if this is a dynamically created event with data attributes
        const eventId = chip.dataset.eventId;
        const eventTitle = chip.dataset.eventTitle;
        const eventStart = chip.dataset.eventStart;
        const eventEnd = chip.dataset.eventEnd;
        const eventCalendar = chip.dataset.eventCalendar;
        const eventPriority = chip.dataset.eventPriority;
        const eventCompleted = chip.dataset.eventCompleted === 'true';
        
        // Set the current event ID for Mark Complete functionality
        currentEventId = eventId ? parseInt(eventId) : null;
        
        // Get form elements
        const startDateEl = document.getElementById('eventStartDate');
        const endDateEl = document.getElementById('eventEndDate');
        const titleField = document.getElementById('eventTitle');
        const noteField = document.getElementById('eventNote');
        const calendarSelect = document.getElementById('eventCalendar');
        const prioritySelect = document.getElementById('eventPriority');
        
        // Get the event from global events to check completed status
        const event = currentEventId ? globalEvents.find(ev => ev.id === currentEventId) : null;
        const isCompleted = event ? event.completed : eventCompleted;
        
        // Update Mark Complete button based on event's completed status
        updateMarkCompleteButtonState(isCompleted);
        
        // Update modal card completed styling
        if (modalCard) {
            if (isCompleted) {
                modalCard.classList.add('completed');
            } else {
                modalCard.classList.remove('completed');
            }
        }
        
        if (eventId && eventTitle) {
            // Use data from data attributes (dynamically created events)
            if (startDateEl) startDateEl.value = eventStart || '';
            if (endDateEl) endDateEl.value = eventEnd || '';
            if (titleField) titleField.value = eventTitle || '';
            if (noteField) noteField.value = eventTitle || '';
            if (calendarSelect) calendarSelect.value = eventCalendar || 'analytics';
            if (prioritySelect) prioritySelect.value = eventPriority ? eventPriority.toLowerCase() : 'low';
        } else {
            // Fallback: Get event info from chip text and color class (old behavior)
            const chipText = chip.textContent.trim();
            const chipClass = chip.className;
            
            // Determine calendar based on color
            let calendar = 'analytics';
            if (chipClass.includes('yellow')) calendar = 'analytics';
            else if (chipClass.includes('green')) calendar = 'marketing';
            else if (chipClass.includes('blue')) calendar = 'history';
            else if (chipClass.includes('orange')) calendar = 'accounting';
            else if (chipClass.includes('teal')) calendar = 'finance';
            
            if (calendarSelect) calendarSelect.value = calendar;
            
            if (chipText.includes('Boris')) {
                if (titleField) titleField.value = 'Topic: Boris and competitive conversion\nReadings: SHMA 152-174';
                if (noteField) noteField.value = 'Topic: Boris and competitive conversion\n\nReadings: SHMA 152-174';
            } else {
                if (titleField) titleField.value = chipText;
                if (noteField) noteField.value = chipText;
            }
            
            if (startDateEl) startDateEl.value = '12/07/2025 12:30 PM';
            if (endDateEl) endDateEl.value = '12/07/2025 01:00 PM';
        }
    }
    
    function updateMarkCompleteButtonState(isCompleted) {
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        if (markCompleteBtn) {
            if (isCompleted) {
                markCompleteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                    Mark Incomplete
                `;
                markCompleteBtn.classList.remove('btn-success');
                markCompleteBtn.classList.add('btn-secondary');
            } else {
                markCompleteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Mark Complete
                `;
                markCompleteBtn.classList.remove('btn-secondary');
                markCompleteBtn.classList.add('btn-success');
            }
        }
    }
    
    // Event Listeners
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    if (editToggleBtn) {
        editToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isEditMode) {
                storeOriginalValues();
            }
            setEditMode(!isEditMode);
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            restoreOriginalValues();
            setEditMode(false);
        });
    }
    
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Update the event in globalEvents with the new values
            if (currentEventId !== null) {
                const event = globalEvents.find(ev => ev.id === currentEventId);
                if (event) {
                    const startDateEl = document.getElementById('eventStartDate');
                    const endDateEl = document.getElementById('eventEndDate');
                    const titleEl = document.getElementById('eventTitle');
                    const noteEl = document.getElementById('eventNote');
                    const calendarEl = document.getElementById('eventCalendar');
                    const priorityEl = document.getElementById('eventPriority');
                    
                    // Parse dates from input values
                    if (startDateEl && startDateEl.value) {
                        const parsedStart = parseDateString(startDateEl.value);
                        if (parsedStart) event.date = parsedStart;
                    }
                    if (endDateEl && endDateEl.value) {
                        const parsedEnd = parseDateString(endDateEl.value);
                        if (parsedEnd) event.endDate = parsedEnd;
                    }
                    if (titleEl) event.title = titleEl.value;
                    if (noteEl) event.note = noteEl.value;
                    if (calendarEl) {
                        event.calendar = calendarEl.value;
                        // Update event color to match the new course's color
                        event.color = getCourseColorClass(calendarEl.value);
                    }
                    if (priorityEl) event.priority = priorityEl.value;
                    
                    // Save to localStorage
                    saveEventsToStorage();
                    
                    // Re-render dashboard events if on dashboard
                    renderDashboardEvents();
                    
                    // Sync UI on current page
                    syncUIWithSavedData();
                    
                    // Refresh calendar views if on calendar page
                    const refreshEvent = new CustomEvent('refreshCalendarViews');
                    document.dispatchEvent(refreshEvent);
                }
            }
            
            storeOriginalValues();
            setEditMode(false);
            
            // Show a brief success indication then close the modal
            saveEventBtn.textContent = 'Saved!';
            saveEventBtn.style.background = 'var(--success)';
            setTimeout(() => {
                saveEventBtn.textContent = 'Save Changes';
                saveEventBtn.style.background = '';
                // Close the modal after saving
                closeModal();
            }, 800);
        });
    }
    
    // Mark Complete button handler
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (currentEventId !== null) {
                const event = globalEvents.find(ev => ev.id === currentEventId);
                if (event) {
                    // Toggle completed status
                    event.completed = !event.completed;
                    
                    // Save to localStorage
                    saveEventsToStorage();
                    
                    // Re-render dashboard events
                    renderDashboardEvents();
                    
                    // Update the task row on dashboard if it exists
                    updateTaskRowCompletedState(currentEventId, event.completed);
                    
                    // Trigger calendar view refresh if on calendar page
                    const refreshEvent = new CustomEvent('refreshCalendarViews');
                    document.dispatchEvent(refreshEvent);
                    
                    // Close the modal automatically
                    closeModal();
                }
            }
        });
    }
    
    function updateTaskRowCompletedState(eventId, isCompleted) {
        // Find the task element with matching event ID (works for dashboard, tasks list, and task table)
        const taskRow = document.querySelector(`.task-row[data-event-id="${eventId}"]`);
        const tableRow = document.querySelector(`.task-table-row[data-event-id="${eventId}"]`);
        const taskItem = document.querySelector(`.task-item[data-event-id="${eventId}"]`);
        
        if (taskRow) {
            if (isCompleted) {
                taskRow.classList.add('completed');
            } else {
                taskRow.classList.remove('completed');
            }
        }
        
        if (tableRow) {
            if (isCompleted) {
                tableRow.classList.add('completed');
            } else {
                tableRow.classList.remove('completed');
            }
        }
        
        if (taskItem) {
            if (isCompleted) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        }
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// Add Event Modal
// ============================================

function initAddEventModal() {
    const addEventModal = document.getElementById('addEventModal');
    if (!addEventModal) return;
    
    const modalCard = addEventModal.querySelector('.add-event-modal');
    const closeAddEventBtn = document.getElementById('closeAddEventModal');
    const cancelAddEventBtn = document.getElementById('cancelAddEventBtn');
    const clearAddEventBtn = document.getElementById('clearAddEventBtn');
    const saveAddEventBtn = document.getElementById('saveAddEventBtn');
    const reminderToggle = document.getElementById('newEventReminder');
    const reminderFields = document.getElementById('newReminderFields');
    const calendarSelect = document.getElementById('newEventCalendar');
    
    // Get all Add Event buttons
    const addEventBtns = document.querySelectorAll('[data-action="add-event"], .header-actions .btn-primary');
    
    // Open modal when clicking Add Event button
    addEventBtns.forEach(btn => {
        if (btn.textContent.includes('Add Event')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openAddEventModal();
            });
        }
    });
    
    // Also handle buttons with the plus icon and "Add Event" text
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent.trim().includes('Add Event')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openAddEventModal();
            });
        }
    });
    
    // Round time to nearest 30 minutes
    function getRoundedTime(date = new Date()) {
        const roundedDate = new Date(date);
        const minutes = roundedDate.getMinutes();
        
        // Round to nearest 30 minutes
        if (minutes < 15) {
            roundedDate.setMinutes(0);
        } else if (minutes < 45) {
            roundedDate.setMinutes(30);
        } else {
            roundedDate.setMinutes(0);
            roundedDate.setHours(roundedDate.getHours() + 1);
        }
        
        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);
        
        return roundedDate;
    }
    
    // Format date for input field
    function formatDateTimeForInput(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
    }
    
    function openAddEventModal(prefilledDate = null) {
        addEventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const startDateInput = document.getElementById('newEventStartDate');
        const endDateInput = document.getElementById('newEventEndDate');
        
        let startTime;
        
        if (prefilledDate) {
            // If a date was clicked on calendar, use that date with rounded current time
            const now = new Date();
            const roundedNow = getRoundedTime(now);
            
            // Use the prefilled date but with the rounded current time
            startTime = new Date(prefilledDate);
            startTime.setHours(roundedNow.getHours());
            startTime.setMinutes(roundedNow.getMinutes());
            startTime.setSeconds(0);
        } else {
            // No date provided, use current rounded time
            startTime = getRoundedTime();
        }
        
        // End time is 30 minutes after start
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        if (startDateInput) {
            startDateInput.value = formatDateTimeForInput(startTime);
        }
        
        if (endDateInput) {
            endDateInput.value = formatDateTimeForInput(endTime);
        }
    }
    
    // Make openAddEventModal available globally for calendar cell clicks
    window.openAddEventModal = openAddEventModal;
    
    function closeAddEventModal() {
        addEventModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset modal border
        if (modalCard) {
            modalCard.classList.remove('analytics', 'accounting', 'history', 'finance', 'marketing');
        }
    }
    
    function clearAddEventForm() {
        const startDate = document.getElementById('newEventStartDate');
        const endDate = document.getElementById('newEventEndDate');
        const title = document.getElementById('newEventTitle');
        const note = document.getElementById('newEventNote');
        const calendar = document.getElementById('newEventCalendar');
        const priority = document.getElementById('newEventPriority');
        const reminder = document.getElementById('newEventReminder');
        
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';
        if (title) title.value = '';
        if (note) note.value = '';
        if (calendar) calendar.value = '';
        if (priority) priority.value = 'low';
        if (reminder) reminder.checked = false;
        
        // Reset notifications to just one
        const container = document.getElementById('newEventNotificationsContainer');
        if (container) {
            const rows = container.querySelectorAll('.notification-row');
            // Remove all but the first row
            rows.forEach((row, index) => {
                if (index > 0) row.remove();
            });
            // Reset the first row values
            const firstRow = container.querySelector('.notification-row');
            if (firstRow) {
                const unitSelect = firstRow.querySelector('select[name="newReminderUnit"]');
                const valueInput = firstRow.querySelector('input[name="newReminderValue"]');
                const removeBtn = firstRow.querySelector('.remove-notification-btn');
                if (unitSelect) unitSelect.value = 'days';
                if (valueInput) valueInput.value = '1';
                if (removeBtn) removeBtn.style.display = 'none';
            }
            // Update the add button - show it since we're back to 1 notification
            const addBtn = document.getElementById('addNewEventNotificationBtn');
            if (addBtn) {
                addBtn.style.display = 'flex';
                const countSpan = addBtn.querySelector('.notification-count');
                if (countSpan) countSpan.textContent = '(1/3)';
            }
        }
        
        // Hide reminder fields
        if (reminderFields) {
            reminderFields.style.display = 'none';
        }
        
        // Reset modal border
        if (modalCard) {
            modalCard.classList.remove('analytics', 'accounting', 'history', 'finance', 'marketing');
        }
    }
    
    // Reminder toggle - show/hide fields
    if (reminderToggle && reminderFields) {
        reminderToggle.addEventListener('change', () => {
            if (reminderToggle.checked) {
                reminderFields.style.display = 'block';
            } else {
                reminderFields.style.display = 'none';
            }
        });
    }
    
    // Calendar selection - update modal border color
    if (calendarSelect && modalCard) {
        calendarSelect.addEventListener('change', () => {
            const calendarValue = calendarSelect.value;
            // Remove all calendar classes
            modalCard.classList.remove('analytics', 'accounting', 'history', 'finance', 'marketing');
            // Add the selected calendar class
            if (calendarValue) {
                modalCard.classList.add(calendarValue);
            }
        });
    }
    
    // Close button
    if (closeAddEventBtn) {
        closeAddEventBtn.addEventListener('click', closeAddEventModal);
    }
    
    // Cancel button
    if (cancelAddEventBtn) {
        cancelAddEventBtn.addEventListener('click', closeAddEventModal);
    }
    
    // Clear button
    if (clearAddEventBtn) {
        clearAddEventBtn.addEventListener('click', clearAddEventForm);
    }
    
    // Save button
    if (saveAddEventBtn) {
        saveAddEventBtn.addEventListener('click', () => {
            // Get form values
            const startDateEl = document.getElementById('newEventStartDate');
            const endDateEl = document.getElementById('newEventEndDate');
            const titleEl = document.getElementById('newEventTitle');
            const noteEl = document.getElementById('newEventNote');
            const calendarEl = document.getElementById('newEventCalendar');
            const priorityEl = document.getElementById('newEventPriority');
            
            // Validate required fields
            if (!startDateEl?.value || !endDateEl?.value || !titleEl?.value) {
                alert('Please fill in Start Date, End Date, and Title');
                return;
            }
            
            // Create new event
            const newEvent = {
                id: Date.now(), // Use timestamp as unique ID
                title: titleEl.value,
                note: noteEl?.value || '',
                date: parseDateString(startDateEl.value) || new Date(),
                endDate: parseDateString(endDateEl.value) || new Date(),
                calendar: calendarEl?.value || 'analytics',
                color: getColorForCalendar(calendarEl?.value || 'analytics'),
                priority: priorityEl?.value || 'Low',
                completed: false
            };
            
            // Add to globalEvents
            globalEvents.push(newEvent);
            
            // Save to localStorage
            saveEventsToStorage();
            
            // Re-render dashboard events if on dashboard
            renderDashboardEvents();
            
            // Sync UI on current page
            syncUIWithSavedData();
            
            // Show saved feedback
            saveAddEventBtn.textContent = 'Saved!';
            saveAddEventBtn.style.background = 'var(--course-green)';
            setTimeout(() => {
                saveAddEventBtn.textContent = 'Save';
                saveAddEventBtn.style.background = '';
                clearAddEventForm();
                closeAddEventModal();
                
                // Refresh calendar views if on calendar page
                const refreshEvent = new CustomEvent('refreshCalendarViews');
                document.dispatchEvent(refreshEvent);
            }, 1000);
        });
    }
    
    // Helper to get color for calendar
    function getColorForCalendar(calendar) {
        const colorMap = {
            'analytics': 'yellow',
            'accounting': 'orange',
            'history': 'lime',
            'finance': 'green',
            'marketing': 'teal'
        };
        return colorMap[calendar] || 'yellow';
    }
    
    // Close on backdrop click
    addEventModal.addEventListener('click', (e) => {
        if (e.target === addEventModal) {
            closeAddEventModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && addEventModal.classList.contains('active')) {
            closeAddEventModal();
        }
    });
}

// ============================================
// Calendar View Switching
// ============================================

function initCalendarViews() {
    const viewBtns = document.querySelectorAll('.view-btn[data-view]');
    const todayBtn = document.getElementById('todayBtn');
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarBody = document.querySelector('.calendar-body');
    const weekView = document.getElementById('weekView');
    const dayView = document.getElementById('dayView');
    const weekViewHeader = document.getElementById('weekViewHeader');
    const weekTimeSlots = document.getElementById('weekTimeSlots');
    const dayTimeSlots = document.getElementById('dayTimeSlots');
    const currentMonthEl = document.querySelector('.current-month');
    const prevBtn = document.querySelector('.cal-nav-btn.prev');
    const nextBtn = document.querySelector('.cal-nav-btn.next');
    const miniCalendarTitle = document.querySelector('.mini-calendar-title');
    const miniCalendarGrid = document.querySelector('.mini-calendar-grid');
    const miniPrevBtn = document.querySelector('.mini-calendar .mini-nav-btn.prev');
    const miniNextBtn = document.querySelector('.mini-calendar .mini-nav-btn.next');
    
    // If not on calendar page, exit
    if (!viewBtns.length) return;
    
    let currentView = 'month';
    let currentDate = new Date();
    let miniCalendarDate = new Date();
    const today = new Date();
    
    // Calendar filter - track which calendars are selected
    const selectedCalendars = new Set(['accounting', 'history', 'finance', 'marketing', 'analytics']);
    
    // Initialize calendar filter checkboxes
    initCalendarFilters();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Use global events data
    const events = globalEvents;
    
    // View toggle buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
            
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Today button
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            miniCalendarDate = new Date();
            updateAllViews();
        });
    }
    
    // Main calendar navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateCalendar(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateCalendar(1);
        });
    }
    
    // Mini calendar navigation
    if (miniPrevBtn) {
        miniPrevBtn.addEventListener('click', () => {
            miniCalendarDate.setMonth(miniCalendarDate.getMonth() - 1);
            updateMiniCalendar();
        });
    }
    
    if (miniNextBtn) {
        miniNextBtn.addEventListener('click', () => {
            miniCalendarDate.setMonth(miniCalendarDate.getMonth() + 1);
            updateMiniCalendar();
        });
    }
    
    function switchView(view) {
        currentView = view;
        
        // Hide all views
        if (calendarGrid) calendarGrid.style.display = 'none';
        if (weekView) weekView.style.display = 'none';
        if (dayView) dayView.style.display = 'none';
        
        // Show selected view and update
        switch(view) {
            case 'month':
                if (calendarGrid) calendarGrid.style.display = 'block';
                updateMonthView();
                break;
            case 'week':
                if (weekView) weekView.style.display = 'block';
                updateWeekView();
                // Scroll to current time after view is rendered
                requestAnimationFrame(() => {
                    scrollViewToCurrentTime(weekView, 'week');
                });
                break;
            case 'day':
                if (dayView) dayView.style.display = 'block';
                updateDayView();
                // Scroll to current time after view is rendered
                requestAnimationFrame(() => {
                    scrollViewToCurrentTime(dayView, 'day');
                });
                break;
        }
        
        updateHeaderDisplay();
        updateMiniCalendar();
    }
    
    function scrollViewToCurrentTime(container, viewType) {
        if (!container) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const hourHeight = viewType === 'week' ? 60 : 70;
        const startHour = 0;
        const endHour = 24;
        
        // Calculate target hour - use current time
        let targetHour = currentHour;
        let targetMinutes = currentMinutes;
        
        // Calculate the scroll position
        const timeOffset = (targetHour - startHour) + (targetMinutes / 60);
        const targetTop = timeOffset * hourHeight;
        
        // Find the scrollable element (.week-view-body or .day-view-body)
        const scrollContainer = container.querySelector('.week-view-body, .day-view-body');
        if (!scrollContainer) return;
        
        // Calculate scroll position to center the target time
        const containerHeight = scrollContainer.clientHeight;
        const scrollTarget = targetTop - (containerHeight / 2);
        
        // Scroll to the target position
        scrollContainer.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
        });
    }
    
    function navigateCalendar(direction) {
        switch(currentView) {
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + direction);
                miniCalendarDate = new Date(currentDate);
                updateMonthView();
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + (direction * 7));
                updateWeekView();
                break;
            case 'day':
                currentDate.setDate(currentDate.getDate() + direction);
                updateDayView();
                break;
        }
        updateHeaderDisplay();
        updateMiniCalendar();
    }
    
    function updateAllViews() {
        updateHeaderDisplay();
        updateMiniCalendar();
        
        switch(currentView) {
            case 'month':
                updateMonthView();
                break;
            case 'week':
                updateWeekView();
                break;
            case 'day':
                updateDayView();
                break;
        }
    }
    
    function updateHeaderDisplay() {
        if (!currentMonthEl) return;
        
        switch(currentView) {
            case 'month':
                currentMonthEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                break;
            case 'week':
                const weekStart = getWeekStart(currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    currentMonthEl.textContent = `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                } else {
                    currentMonthEl.textContent = `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                }
                break;
            case 'day':
                currentMonthEl.textContent = `${dayNames[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
                break;
        }
    }
    
    function getEventsForDate(date) {
        return events.filter(event => {
            // Check if calendar is selected
            const calendarName = event.calendar?.toLowerCase() || '';
            if (!selectedCalendars.has(calendarName)) {
                return false;
            }
            
            return event.date.getFullYear() === date.getFullYear() &&
                   event.date.getMonth() === date.getMonth() &&
                   event.date.getDate() === date.getDate();
        });
    }
    
    // Initialize calendar filter checkboxes
    function initCalendarFilters() {
        const filterCheckboxes = document.querySelectorAll('.class-item input[type="checkbox"][data-calendar]');
        
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const calendar = e.target.dataset.calendar;
                
                if (e.target.checked) {
                    selectedCalendars.add(calendar);
                } else {
                    selectedCalendars.delete(calendar);
                }
                
                // Refresh all calendar views
                updateAllViews();
            });
        });
    }
    
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minuteStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minuteStr} ${ampm}`;
    }
    
    function formatDateTime(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year} ${formatTime(date)}`;
    }
    
    function createEventDataAttrs(event) {
        return `data-event-id="${event.id}" data-event-title="${event.title}" data-event-start="${formatDateTime(event.date)}" data-event-end="${formatDateTime(event.endDate)}" data-event-calendar="${event.calendar}" data-event-priority="${event.priority}" data-event-completed="${event.completed || false}"`; 
    }
    
    function getCompletedClass(event) {
        return event.completed ? ' completed' : '';
    }
    
    // Generate high priority indicator HTML
    function getPriorityIndicator(event) {
        if (event.priority && event.priority.toLowerCase() === 'high') {
            return '<span class="priority-indicator high" title="High Priority">!</span>';
        }
        return '';
    }
    
    // ============================================
    // Drag and Drop Functionality
    // ============================================
    
    let draggedEvent = null;
    let draggedEventId = null;
    
    function initDragAndDrop() {
        // Make all events draggable
        const eventChips = document.querySelectorAll('.event-chip, .week-event, .day-event');
        eventChips.forEach(chip => {
            chip.setAttribute('draggable', 'true');
            chip.addEventListener('dragstart', handleDragStart);
            chip.addEventListener('dragend', handleDragEnd);
        });
        
        // Make calendar cells droppable (month view)
        const calendarCells = document.querySelectorAll('.calendar-cell');
        calendarCells.forEach(cell => {
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('dragenter', handleDragEnter);
            cell.addEventListener('dragleave', handleDragLeave);
            cell.addEventListener('drop', handleDropOnCell);
        });
        
        // Make time slots droppable (week view)
        const weekTimeSlots = document.querySelectorAll('.time-slot');
        weekTimeSlots.forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDropOnWeekTimeSlot);
        });
        
        // Make time slots droppable (day view)
        const dayTimeSlots = document.querySelectorAll('.day-time-content');
        dayTimeSlots.forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDropOnDayTimeSlot);
        });
        
        // Make week day columns droppable
        const weekDayEvents = document.querySelectorAll('.week-day-events');
        weekDayEvents.forEach((col, index) => {
            col.dataset.dayIndex = index;
            col.addEventListener('dragover', handleDragOver);
            col.addEventListener('dragenter', handleDragEnter);
            col.addEventListener('dragleave', handleDragLeave);
            col.addEventListener('drop', handleDropOnWeekDay);
        });
        
        // Make day events container droppable
        const dayEventsContainer = document.querySelector('.day-events-container');
        if (dayEventsContainer) {
            dayEventsContainer.addEventListener('dragover', handleDragOver);
            dayEventsContainer.addEventListener('drop', handleDropOnDayContainer);
        }
    }
    
    function handleDragStart(e) {
        draggedEvent = e.target;
        draggedEventId = parseInt(e.target.dataset.eventId);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedEventId);
        
        // Add visual feedback
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    }
    
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        e.target.style.opacity = '';
        draggedEvent = null;
        draggedEventId = null;
        
        // Remove all drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    function handleDropOnCell(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedEventId) return;
        
        const cell = e.currentTarget;
        const newDateStr = cell.dataset.date;
        if (!newDateStr) return;
        
        const event = globalEvents.find(ev => ev.id === draggedEventId);
        if (!event) return;
        
        // Calculate duration of the event
        const duration = event.endDate - event.date;
        
        // Parse the new date and keep the same time
        const newDate = new Date(newDateStr + 'T00:00:00');
        newDate.setHours(event.date.getHours());
        newDate.setMinutes(event.date.getMinutes());
        
        // Update event dates
        event.date = newDate;
        event.endDate = new Date(newDate.getTime() + duration);
        
        // Save and refresh
        saveEventsToStorage();
        updateView();
    }
    
    function handleDropOnWeekTimeSlot(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedEventId) return;
        
        const slot = e.currentTarget;
        const hour = parseInt(slot.dataset.hour);
        const dayIndex = parseInt(slot.dataset.day);
        if (isNaN(hour) || isNaN(dayIndex)) return;
        
        const event = globalEvents.find(ev => ev.id === draggedEventId);
        if (!event) return;
        
        // Calculate duration of the event
        const duration = event.endDate - event.date;
        
        // Get the week start and calculate the new date
        const weekStart = getWeekStart(currentDate);
        const newDate = new Date(weekStart);
        newDate.setDate(newDate.getDate() + dayIndex);
        newDate.setHours(hour);
        newDate.setMinutes(0);
        
        event.date = newDate;
        event.endDate = new Date(newDate.getTime() + duration);
        
        // Save and refresh
        saveEventsToStorage();
        updateView();
    }
    
    function handleDropOnDayTimeSlot(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedEventId) return;
        
        const slot = e.currentTarget;
        const hour = parseInt(slot.dataset.hour);
        if (isNaN(hour)) return;
        
        const event = globalEvents.find(ev => ev.id === draggedEventId);
        if (!event) return;
        
        // Calculate duration of the event
        const duration = event.endDate - event.date;
        
        // Update to the current day view date with new hour
        const newDate = new Date(currentDate);
        newDate.setHours(hour);
        newDate.setMinutes(0);
        
        event.date = newDate;
        event.endDate = new Date(newDate.getTime() + duration);
        
        // Save and refresh
        saveEventsToStorage();
        updateView();
    }
    
    function handleDropOnDayContainer(e) {
        e.preventDefault();
        
        if (!draggedEventId) return;
        
        const event = globalEvents.find(ev => ev.id === draggedEventId);
        if (!event) return;
        
        // Calculate drop position to determine hour
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hourHeight = 70;
        const startHour = 0;
        const droppedHour = Math.floor(y / hourHeight) + startHour;
        
        // Calculate duration of the event
        const duration = event.endDate - event.date;
        
        // Update to the current day view date with new hour
        const newDate = new Date(currentDate);
        newDate.setHours(Math.max(0, Math.min(23, droppedHour)));
        newDate.setMinutes(0);
        
        event.date = newDate;
        event.endDate = new Date(newDate.getTime() + duration);
        
        // Save and refresh
        saveEventsToStorage();
        updateView();
    }
    
    function handleDropOnWeekDay(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedEventId) return;
        
        const dayIndex = parseInt(e.currentTarget.dataset.dayIndex);
        if (isNaN(dayIndex)) return;
        
        const event = globalEvents.find(ev => ev.id === draggedEventId);
        if (!event) return;
        
        // Calculate duration of the event
        const duration = event.endDate - event.date;
        
        // Get the week start and calculate the new date
        const weekStart = getWeekStart(currentDate);
        const newDate = new Date(weekStart);
        newDate.setDate(newDate.getDate() + dayIndex);
        
        // Calculate drop position to determine hour
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hourHeight = 60;
        const startHour = 0;
        const droppedHour = Math.floor(y / hourHeight) + startHour;
        
        newDate.setHours(Math.max(0, Math.min(23, droppedHour)));
        newDate.setMinutes(0);
        
        event.date = newDate;
        event.endDate = new Date(newDate.getTime() + duration);
        
        // Save and refresh
        saveEventsToStorage();
        updateView();
    }
    
    function updateView() {
        if (currentView === 'month') {
            updateMonthView();
        } else if (currentView === 'week') {
            updateWeekView();
        } else if (currentView === 'day') {
            updateDayView();
        }
        updateMiniCalendar();
    }
    
    function updateMonthView() {
        if (!calendarBody) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const maxVisibleEvents = 2; // Maximum events to show before "more" indicator
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Get days from previous month
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        // Helper function to build events HTML with "more" indicator
        function buildEventsHtml(dayEvents, dateStr) {
            let eventsHtml = '';
            const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
            const remainingCount = dayEvents.length - maxVisibleEvents;
            
            visibleEvents.forEach(event => {
                eventsHtml += `<div class="event-chip ${event.color}${getCompletedClass(event)}" role="button" tabindex="0" ${createEventDataAttrs(event)}>${getPriorityIndicator(event)}${event.title.substring(0, 12)}...</div>`;
            });
            
            if (remainingCount > 0) {
                eventsHtml += `<button class="events-more-btn" data-date="${dateStr}" title="View all ${dayEvents.length} events">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="19" cy="12" r="2"/>
                    </svg>
                    <span>+${remainingCount} more</span>
                </button>`;
            }
            
            return eventsHtml;
        }
        
        // Build calendar HTML
        let html = '';
        let dayCount = 1;
        let nextMonthDay = 1;
        
        // Calculate number of weeks needed
        const totalCells = startingDay + daysInMonth;
        const numWeeks = Math.ceil(totalCells / 7);
        
        for (let week = 0; week < numWeeks; week++) {
            html += '<div class="calendar-week">';
            
            for (let day = 0; day < 7; day++) {
                const cellIndex = week * 7 + day;
                
                if (cellIndex < startingDay) {
                    // Previous month days
                    const prevDay = daysInPrevMonth - startingDay + cellIndex + 1;
                    const prevMonthDate = new Date(year, month - 1, prevDay);
                    const prevDayEvents = getEventsForDate(prevMonthDate);
                    const prevDateStr = prevMonthDate.toISOString().split('T')[0];
                    const eventsHtml = buildEventsHtml(prevDayEvents, prevDateStr);
                    html += `<div class="calendar-cell other-month" data-date="${prevDateStr}"><span class="cell-date">${prevDay}</span>${eventsHtml ? '<div class="cell-events">' + eventsHtml + '</div>' : ''}</div>`;
                } else if (dayCount <= daysInMonth) {
                    // Current month days
                    const cellDate = new Date(year, month, dayCount);
                    const cellDateStr = cellDate.toISOString().split('T')[0];
                    const dayEvents = getEventsForDate(cellDate);
                    const isToday = dayCount === today.getDate() && 
                                   month === today.getMonth() && 
                                   year === today.getFullYear();
                    const todayClass = isToday ? ' today' : '';
                    
                    const eventsHtml = buildEventsHtml(dayEvents, cellDateStr);
                    
                    html += `<div class="calendar-cell${todayClass}" data-date="${cellDateStr}"><span class="cell-date">${dayCount}</span>${eventsHtml ? '<div class="cell-events">' + eventsHtml + '</div>' : ''}</div>`;
                    dayCount++;
                } else {
                    // Next month days
                    const nextMonthDate = new Date(year, month + 1, nextMonthDay);
                    const nextDateStr = nextMonthDate.toISOString().split('T')[0];
                    const nextDayEvents = getEventsForDate(nextMonthDate);
                    const eventsHtml = buildEventsHtml(nextDayEvents, nextDateStr);
                    html += `<div class="calendar-cell other-month" data-date="${nextDateStr}"><span class="cell-date">${nextMonthDay}</span>${eventsHtml ? '<div class="cell-events">' + eventsHtml + '</div>' : ''}</div>`;
                    nextMonthDay++;
                }
            }
            
            html += '</div>';
        }
        
        calendarBody.innerHTML = html;
        initDragAndDrop();
        
        // Add click handlers for "more" buttons
        const moreButtons = calendarBody.querySelectorAll('.events-more-btn');
        moreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dateStr = btn.dataset.date;
                const [yearStr, monthStr, dayStr] = dateStr.split('-');
                
                // Update current date to the clicked date
                currentDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
                
                // Switch to day view
                switchView('day');
                
                // Update active button
                viewBtns.forEach(b => b.classList.remove('active'));
                const dayBtn = document.querySelector('.view-btn[data-view="day"]');
                if (dayBtn) dayBtn.classList.add('active');
            });
        });
    }
    
    // Helper function to calculate overlapping event layouts
    function calculateOverlappingLayout(events) {
        if (events.length === 0) return [];
        
        // Sort events by start time, then by duration (longer first)
        const sortedEvents = [...events].sort((a, b) => {
            const startDiff = a.date.getTime() - b.date.getTime();
            if (startDiff !== 0) return startDiff;
            // If same start time, longer events come first
            const aDuration = a.endDate - a.date;
            const bDuration = b.endDate - b.date;
            return bDuration - aDuration;
        });
        
        // Track columns for each event
        const eventLayouts = [];
        const columns = []; // Each column tracks the end time of the last event placed there
        
        sortedEvents.forEach(event => {
            const eventStart = event.date.getTime();
            const eventEnd = event.endDate.getTime();
            
            // Find the first available column where this event doesn't overlap
            let columnIndex = -1;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i] <= eventStart) {
                    columnIndex = i;
                    break;
                }
            }
            
            // If no column is available, create a new one
            if (columnIndex === -1) {
                columnIndex = columns.length;
                columns.push(eventEnd);
            } else {
                columns[columnIndex] = eventEnd;
            }
            
            eventLayouts.push({
                event,
                columnIndex,
                totalColumns: 0 // Will be calculated after
            });
        });
        
        // Now calculate the total columns for each group of overlapping events
        // Group events that overlap with each other
        for (let i = 0; i < eventLayouts.length; i++) {
            const layout = eventLayouts[i];
            const eventStart = layout.event.date.getTime();
            const eventEnd = layout.event.endDate.getTime();
            
            // Find all events that overlap with this one
            let maxColumn = layout.columnIndex;
            for (let j = 0; j < eventLayouts.length; j++) {
                const otherLayout = eventLayouts[j];
                const otherStart = otherLayout.event.date.getTime();
                const otherEnd = otherLayout.event.endDate.getTime();
                
                // Check if events overlap
                if (eventStart < otherEnd && eventEnd > otherStart) {
                    maxColumn = Math.max(maxColumn, otherLayout.columnIndex);
                }
            }
            
            layout.totalColumns = maxColumn + 1;
        }
        
        // Second pass: ensure all overlapping events share the same totalColumns value
        for (let i = 0; i < eventLayouts.length; i++) {
            const layout = eventLayouts[i];
            const eventStart = layout.event.date.getTime();
            const eventEnd = layout.event.endDate.getTime();
            
            for (let j = 0; j < eventLayouts.length; j++) {
                const otherLayout = eventLayouts[j];
                const otherStart = otherLayout.event.date.getTime();
                const otherEnd = otherLayout.event.endDate.getTime();
                
                // Check if events overlap
                if (eventStart < otherEnd && eventEnd > otherStart) {
                    const maxTotal = Math.max(layout.totalColumns, otherLayout.totalColumns);
                    layout.totalColumns = maxTotal;
                    otherLayout.totalColumns = maxTotal;
                }
            }
        }
        
        return eventLayouts;
    }
    
    function updateWeekView() {
        if (!weekViewHeader || !weekTimeSlots) return;
        
        const weekStart = getWeekStart(currentDate);
        const hourHeight = 60; // Height of each hour row in pixels
        const startHour = 0; // Week view starts at 12 AM
        
        // Build header
        let headerHtml = '<div class="week-time-column"></div>';
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + i);
            const isToday = dayDate.toDateString() === today.toDateString();
            const todayClass = isToday ? ' today' : '';
            headerHtml += `
                <div class="week-day-column">
                    <span class="week-day-name">${dayNamesShort[i]}</span>
                    <span class="week-day-date${todayClass}">${dayDate.getDate()}</span>
                </div>
            `;
        }
        weekViewHeader.innerHTML = headerHtml;
        
        // Build time slots (6 AM to 8 PM)
        let slotsHtml = '';
        for (let hour = startHour; hour <= 23; hour++) {
            const hourLabel = hour === 0 ? '12 AM' : (hour === 12 ? '12 PM' : (hour > 12 ? `${hour - 12} PM` : `${hour} AM`));
            
            slotsHtml += `<div class="time-slot-row" data-hour="${hour}"><div class="time-label">${hourLabel}</div>`;
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                slotsHtml += `<div class="time-slot" data-hour="${hour}" data-day="${dayOffset}"></div>`;
            }
            
            slotsHtml += '</div>';
        }
        
        // Build events container with absolutely positioned events
        let eventsHtml = '<div class="week-events-container">';
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + dayOffset);
            const dayEvents = getEventsForDate(dayDate);
            
            // Calculate overlapping layout for this day's events
            const eventLayouts = calculateOverlappingLayout(dayEvents);
            
            eventsHtml += '<div class="week-day-events">';
            eventLayouts.forEach(layout => {
                const event = layout.event;
                const eventStartHour = event.date.getHours();
                const eventStartMinutes = event.date.getMinutes();
                
                // Calculate top position (from start of week view)
                const startOffset = (eventStartHour - startHour) + (eventStartMinutes / 60);
                const top = startOffset * hourHeight;
                
                // Calculate height based on duration
                const durationHours = (event.endDate - event.date) / (1000 * 60 * 60);
                const height = Math.max(30, durationHours * hourHeight);
                
                // Calculate width and left position for overlapping events
                const width = (100 / layout.totalColumns);
                const left = layout.columnIndex * width;
                
                eventsHtml += `
                    <div class="week-event ${event.color}${getCompletedClass(event)}" style="top: ${top}px; height: ${height}px; left: ${left}%; width: calc(${width}% - 4px);" ${createEventDataAttrs(event)} role="button" tabindex="0">
                        ${getPriorityIndicator(event)}
                        <span class="week-event-title">${event.title}</span>
                        <span class="week-event-time">${formatTime(event.date)} - ${formatTime(event.endDate)}</span>
                    </div>
                `;
            });
            eventsHtml += '</div>';
        }
        eventsHtml += '</div>';
        
        weekTimeSlots.innerHTML = slotsHtml + eventsHtml;
        
        // Add current time indicator for current week
        addCurrentTimeIndicator(weekTimeSlots, 'week');
        initDragAndDrop();
    }
    
    function updateDayView() {
        if (!dayTimeSlots) return;
        
        const dayEvents = getEventsForDate(currentDate);
        const hourHeight = 70; // Height of each hour row in pixels
        const startHour = 0; // Day view starts at 12 AM
        
        // Build time slots (12 AM to 11 PM)
        let slotsHtml = '';
        for (let hour = startHour; hour <= 23; hour++) {
            const hourLabel = hour === 0 ? '12 AM' : (hour === 12 ? '12 PM' : (hour > 12 ? `${hour - 12} PM` : `${hour} AM`));
            
            slotsHtml += `
                <div class="day-time-row" data-hour="${hour}">
                    <div class="day-time-label">${hourLabel}</div>
                    <div class="day-time-content" data-hour="${hour}"></div>
                </div>
            `;
        }
        
        // Calculate overlapping layout for day events
        const eventLayouts = calculateOverlappingLayout(dayEvents);
        
        // Build events container with absolutely positioned events
        let eventsHtml = '<div class="day-events-container">';
        eventLayouts.forEach(layout => {
            const event = layout.event;
            const eventStartHour = event.date.getHours();
            const eventStartMinutes = event.date.getMinutes();
            
            // Calculate top position (from start of day view)
            const startOffset = (eventStartHour - startHour) + (eventStartMinutes / 60);
            const top = startOffset * hourHeight;
            
            // Calculate height based on duration
            const durationHours = (event.endDate - event.date) / (1000 * 60 * 60);
            const height = Math.max(40, durationHours * hourHeight);
            
            // Calculate width and left position for overlapping events
            const width = (100 / layout.totalColumns);
            const left = layout.columnIndex * width;
            
            eventsHtml += `
                <div class="day-event ${event.color}${getCompletedClass(event)}" style="top: ${top}px; height: ${height}px; left: calc(${left}% + 0.5rem); width: calc(${width}% - 1rem);" ${createEventDataAttrs(event)} role="button" tabindex="0">
                    ${getPriorityIndicator(event)}
                    <div class="day-event-time">${formatTime(event.date)} - ${formatTime(event.endDate)}</div>
                    <div class="day-event-title">${event.title}</div>
                    <div class="day-event-location">${event.calendar.charAt(0).toUpperCase() + event.calendar.slice(1)} • ${event.priority} Priority</div>
                </div>
            `;
        });
        eventsHtml += '</div>';
        
        dayTimeSlots.innerHTML = slotsHtml + eventsHtml;
        
        // Add current time indicator for today
        addCurrentTimeIndicator(dayTimeSlots, 'day');
        initDragAndDrop();
    }
    
    // Add current time indicator to week/day views
    function addCurrentTimeIndicator(container, viewType) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        // Use correct hourHeight for each view type (week=60, day=70)
        const hourHeight = viewType === 'week' ? 60 : 70;
        const startHour = 0;
        const endHour = 24;
        
        // Check if we should show the indicator
        if (viewType === 'week') {
            // For week view, check if current week includes the app's "today"
            const weekStart = new Date(currentDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            
            // Use the app's today (highlighted date in mini calendar)
            const appToday = new Date(today);
            appToday.setHours(0, 0, 0, 0);
            
            if (appToday < weekStart || appToday >= weekEnd) return;
            
            // Calculate which day column the indicator should be in
            var dayOfWeek = appToday.getDay();
        } else if (viewType === 'day') {
            // For day view, check if viewing the app's "today"
            const viewDate = new Date(currentDate);
            viewDate.setHours(0, 0, 0, 0);
            
            const appToday = new Date(today);
            appToday.setHours(0, 0, 0, 0);
            
            if (viewDate.getTime() !== appToday.getTime()) return;
        }
        
        // Calculate position based on actual current time
        const timeOffset = (currentHour - startHour) + (currentMinutes / 60);
        const topPosition = timeOffset * hourHeight;
        
        // Create time indicator element
        const indicator = document.createElement('div');
        indicator.className = 'current-time-indicator';
        indicator.style.top = `${topPosition}px`;
        
        // For week view, position it across the correct day column
        if (viewType === 'week') {
            const columnWidth = container.offsetWidth / 8; // 8 columns (time + 7 days)
            const leftOffset = columnWidth + (dayOfWeek * columnWidth);
            indicator.style.left = `${leftOffset}px`;
            indicator.style.width = `${columnWidth}px`;
        }
        
        container.appendChild(indicator);
    }
    
    // Update time indicator every minute
    setInterval(() => {
        if (currentView === 'week') {
            updateWeekView();
        } else if (currentView === 'day') {
            updateDayView();
        }
    }, 60000);
    
    function updateMiniCalendar() {
        if (!miniCalendarTitle || !miniCalendarGrid) return;
        
        const year = miniCalendarDate.getFullYear();
        const month = miniCalendarDate.getMonth();
        
        // Update title
        miniCalendarTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Get days from previous month
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        // Build mini calendar HTML - include day headers
        let html = `
            <div class="mini-day-header">Su</div>
            <div class="mini-day-header">Mo</div>
            <div class="mini-day-header">Tu</div>
            <div class="mini-day-header">We</div>
            <div class="mini-day-header">Th</div>
            <div class="mini-day-header">Fr</div>
            <div class="mini-day-header">Sa</div>
        `;
        let dayCount = 1;
        let nextMonthDay = 1;
        
        // Calculate number of weeks needed
        const totalCells = startingDay + daysInMonth;
        const numWeeks = Math.ceil(totalCells / 7);
        
        for (let week = 0; week < numWeeks; week++) {
            for (let day = 0; day < 7; day++) {
                const cellIndex = week * 7 + day;
                
                if (cellIndex < startingDay) {
                    // Previous month days
                    const prevDay = daysInPrevMonth - startingDay + cellIndex + 1;
                    const prevMonthNum = month === 0 ? 11 : month - 1;
                    const prevYearNum = month === 0 ? year - 1 : year;
                    const isSelected = currentDate.getDate() === prevDay && 
                                       currentDate.getMonth() === prevMonthNum && 
                                       currentDate.getFullYear() === prevYearNum;
                    const selectedClass = isSelected ? ' selected' : '';
                    html += `<div class="mini-day other-month${selectedClass}" data-date="${prevYearNum}-${prevMonthNum + 1}-${prevDay}" data-day="${prevDay}" data-month="${prevMonthNum}" data-year="${prevYearNum}">${prevDay}</div>`;
                } else if (dayCount <= daysInMonth) {
                    // Current month days
                    const isToday = dayCount === today.getDate() && 
                                   month === today.getMonth() && 
                                   year === today.getFullYear();
                    const isSelected = currentDate.getDate() === dayCount && 
                                       currentDate.getMonth() === month && 
                                       currentDate.getFullYear() === year;
                    const todayClass = isToday ? ' today' : '';
                    const selectedClass = isSelected ? ' selected' : '';
                    html += `<div class="mini-day${todayClass}${selectedClass}" data-date="${year}-${month + 1}-${dayCount}" data-day="${dayCount}" data-month="${month}" data-year="${year}">${dayCount}</div>`;
                    dayCount++;
                } else {
                    // Next month days
                    const nextMonthNum = month === 11 ? 0 : month + 1;
                    const nextYearNum = month === 11 ? year + 1 : year;
                    const isSelected = currentDate.getDate() === nextMonthDay && 
                                       currentDate.getMonth() === nextMonthNum && 
                                       currentDate.getFullYear() === nextYearNum;
                    const selectedClass = isSelected ? ' selected' : '';
                    html += `<div class="mini-day other-month${selectedClass}" data-date="${nextYearNum}-${nextMonthNum + 1}-${nextMonthDay}" data-day="${nextMonthDay}" data-month="${nextMonthNum}" data-year="${nextYearNum}">${nextMonthDay}</div>`;
                    nextMonthDay++;
                }
            }
        }
        
        miniCalendarGrid.innerHTML = html;
        
        // Add click event listeners to mini calendar days
        const miniDays = miniCalendarGrid.querySelectorAll('.mini-day');
        miniDays.forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dayNum = parseInt(dayEl.dataset.day);
                const monthNum = parseInt(dayEl.dataset.month);
                const yearNum = parseInt(dayEl.dataset.year);
                
                // Update the current date to the selected date
                currentDate = new Date(yearNum, monthNum, dayNum);
                
                // If clicking on a day from a different month, update mini calendar to show that month
                if (dayEl.classList.contains('other-month')) {
                    miniCalendarDate = new Date(yearNum, monthNum, 1);
                }
                
                // Refresh all calendar views
                updateAllViews();
            });
        });
    }
    
    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        return d;
    }
    
    // Initialize all displays
    updateAllViews();
    
    // Listen for refresh events from other parts of the app (e.g., Mark Complete)
    document.addEventListener('refreshCalendarViews', () => {
        updateAllViews();
    });
}

// ============================================
// Date/Time Picker Component
// ============================================

class DateTimePicker {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            showTime: options.showTime !== false,
            format: options.format || 'MM/DD/YYYY hh:mm A',
            minDate: options.minDate || null,  // Minimum selectable date
            maxDate: options.maxDate || null,  // Maximum selectable date
            linkedPicker: options.linkedPicker || null,  // Reference to linked picker
            isStartDate: options.isStartDate || false,  // Is this a start date picker?
            isEndDate: options.isEndDate || false,  // Is this an end date picker?
            requireEditMode: options.requireEditMode || false,  // Require edit-mode class on parent modal
            ...options
        };
        this.selectedDate = new Date();
        this.currentMonth = new Date();
        this.picker = null;
        this.isOpen = false;
        
        this.init();
    }
    
    // Check if the picker is allowed to open (respects edit mode requirement)
    canOpen() {
        if (!this.options.requireEditMode) {
            return true;
        }
        
        // Check if parent modal has edit-mode class
        const modal = this.input.closest('.modal-card, .event-detail-modal');
        if (modal && modal.classList.contains('edit-mode')) {
            return true;
        }
        
        return false;
    }
    
    // Link this picker to another picker for date validation
    linkTo(otherPicker) {
        this.options.linkedPicker = otherPicker;
    }
    
    // Get the minimum allowed date based on linked picker
    getMinDate() {
        if (this.options.isEndDate && this.options.linkedPicker) {
            // End date cannot be before start date
            const startPicker = this.options.linkedPicker;
            if (startPicker.input.value) {
                return startPicker.parseDate(startPicker.input.value);
            }
        }
        return this.options.minDate;
    }
    
    // Get the maximum allowed date based on linked picker
    getMaxDate() {
        // Start date has no max constraint since end date auto-updates
        // Only apply max date if explicitly set in options (not from linked picker)
        return this.options.maxDate;
    }
    
    init() {
        // Make input readonly to prevent manual typing
        this.input.setAttribute('readonly', true);
        
        // Set cursor style based on whether edit mode is required
        this.updateCursorStyle();
        
        // Create picker element
        this.createPicker();
        
        // Add event listeners
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.picker.contains(e.target) && e.target !== this.input) {
                this.close();
            }
        });
        
        // Parse existing value if present
        if (this.input.value) {
            const parsed = this.parseDate(this.input.value);
            if (parsed) {
                this.selectedDate = parsed;
                this.currentMonth = new Date(parsed);
            }
        }
        
        // If requireEditMode, watch for edit-mode class changes to update cursor
        if (this.options.requireEditMode) {
            // Use MutationObserver to watch for class changes on parent modal
            const modal = this.input.closest('.modal-card, .event-detail-modal');
            if (modal) {
                const observer = new MutationObserver(() => {
                    this.updateCursorStyle();
                });
                observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
            }
        }
    }
    
    updateCursorStyle() {
        if (this.options.requireEditMode) {
            this.input.style.cursor = this.canOpen() ? 'pointer' : 'default';
        } else {
            this.input.style.cursor = 'pointer';
        }
    }
    
    createPicker() {
        this.picker = document.createElement('div');
        this.picker.className = 'datetime-picker';
        this.picker.innerHTML = this.getPickerHTML();
        document.body.appendChild(this.picker);
        
        this.attachPickerEvents();
    }
    
    getPickerHTML() {
        return `
            <div class="datetime-picker-container">
                <div class="datetime-picker-calendar">
                    <div class="picker-header">
                        <button class="picker-nav prev-month" type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                        <span class="picker-month-year"></span>
                        <button class="picker-nav next-month" type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    </div>
                    <div class="picker-weekdays">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div class="picker-days"></div>
                </div>
                ${this.options.showTime ? `
                <div class="datetime-picker-time">
                    <div class="time-header">Time</div>
                    <div class="time-list"></div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    attachPickerEvents() {
        // Month navigation
        this.picker.querySelector('.prev-month').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.renderCalendar();
        });
        
        this.picker.querySelector('.next-month').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Day selection
        this.picker.querySelector('.picker-days').addEventListener('click', (e) => {
            const dayEl = e.target.closest('.picker-day:not(.other-month):not(.disabled)');
            if (dayEl) {
                const day = parseInt(dayEl.textContent);
                this.selectedDate.setFullYear(this.currentMonth.getFullYear());
                this.selectedDate.setMonth(this.currentMonth.getMonth());
                this.selectedDate.setDate(day);
                this.renderCalendar();
                this.updateInput();
                
                if (!this.options.showTime) {
                    this.close();
                }
            }
        });
        
        // Time selection
        if (this.options.showTime) {
            this.picker.querySelector('.time-list').addEventListener('click', (e) => {
                const timeEl = e.target.closest('.time-option:not(.disabled)');
                if (timeEl) {
                    const [hours, minutes] = timeEl.dataset.time.split(':').map(Number);
                    this.selectedDate.setHours(hours);
                    this.selectedDate.setMinutes(minutes);
                    this.renderTimeList();
                    this.updateInput();
                }
            });
        }
    }
    
    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Update header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        this.picker.querySelector('.picker-month-year').textContent = `${monthNames[month]} ${year}`;
        
        // Calculate days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        const today = new Date();
        const minDate = this.getMinDate();
        const maxDate = this.getMaxDate();
        
        let html = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="picker-day other-month">${prevMonthDays - i}</div>`;
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === this.selectedDate.getDate() && 
                              month === this.selectedDate.getMonth() && 
                              year === this.selectedDate.getFullYear();
            
            // Check if date is disabled based on min/max constraints
            let isDisabled = false;
            if (minDate) {
                const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                if (currentDate < minDateOnly) {
                    isDisabled = true;
                }
            }
            if (maxDate) {
                const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                if (currentDate > maxDateOnly) {
                    isDisabled = true;
                }
            }
            
            let classes = 'picker-day';
            if (isToday && !isDisabled) classes += ' today';
            if (isSelected && !isDisabled) classes += ' selected';
            if (isDisabled) classes += ' disabled';
            
            html += `<div class="${classes}">${day}</div>`;
        }
        
        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            html += `<div class="picker-day other-month">${i}</div>`;
        }
        
        this.picker.querySelector('.picker-days').innerHTML = html;
        
        if (this.options.showTime) {
            this.renderTimeList();
        }
    }
    
    renderTimeList() {
        if (!this.options.showTime) return;
        
        const timeList = this.picker.querySelector('.time-list');
        const minDate = this.getMinDate();
        const maxDate = this.getMaxDate();
        
        // Check if we're on the same day as the linked picker
        const isSameDayAsMin = minDate && this.isSameDay(this.selectedDate, minDate);
        const isSameDayAsMax = maxDate && this.isSameDay(this.selectedDate, maxDate);
        
        let html = '';
        
        for (let hour = 8; hour <= 20; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const h = hour % 12 || 12;
                const ampm = hour < 12 ? 'AM' : 'PM';
                const timeStr = `${h}:${min.toString().padStart(2, '0')} ${ampm}`;
                const isSelected = this.selectedDate.getHours() === hour && this.selectedDate.getMinutes() === min;
                
                // Check if time is disabled based on constraints
                let isDisabled = false;
                const currentTimeMinutes = hour * 60 + min;
                
                if (isSameDayAsMin) {
                    const minTimeMinutes = minDate.getHours() * 60 + minDate.getMinutes();
                    if (currentTimeMinutes < minTimeMinutes) {
                        isDisabled = true;
                    }
                }
                
                if (isSameDayAsMax) {
                    const maxTimeMinutes = maxDate.getHours() * 60 + maxDate.getMinutes();
                    if (currentTimeMinutes > maxTimeMinutes) {
                        isDisabled = true;
                    }
                }
                
                let classes = 'time-option';
                if (isSelected && !isDisabled) classes += ' selected';
                if (isDisabled) classes += ' disabled';
                
                html += `<div class="${classes}" data-time="${hour}:${min}">${timeStr}</div>`;
            }
        }
        
        timeList.innerHTML = html;
        
        // Scroll to selected time
        const selected = timeList.querySelector('.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'center' });
        }
    }
    
    // Helper to check if two dates are on the same day
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    updateInput() {
        const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = this.selectedDate.getDate().toString().padStart(2, '0');
        const year = this.selectedDate.getFullYear();
        
        let value = `${month}/${day}/${year}`;
        
        if (this.options.showTime) {
            let hours = this.selectedDate.getHours();
            const minutes = this.selectedDate.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            value += ` ${hours}:${minutes} ${ampm}`;
        }
        
        this.input.value = value;
        
        // If this is a start date picker, auto-update the end date to 30 minutes later
        if (this.options.isStartDate && this.options.linkedPicker) {
            this.autoUpdateEndDate();
        }
        
        // Trigger change event
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Auto-update the linked end date picker to 30 minutes after the start date
    autoUpdateEndDate() {
        if (!this.options.linkedPicker) return;
        
        const endPicker = this.options.linkedPicker;
        
        // Set end date to 30 minutes after start date
        const endDate = new Date(this.selectedDate.getTime());
        endDate.setMinutes(endDate.getMinutes() + 30);
        
        // Update the end picker's selected date
        endPicker.selectedDate = endDate;
        endPicker.currentMonth = new Date(endDate);
        
        // Update the end picker's input value
        const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const day = endDate.getDate().toString().padStart(2, '0');
        const year = endDate.getFullYear();
        
        let value = `${month}/${day}/${year}`;
        
        if (endPicker.options.showTime) {
            let hours = endDate.getHours();
            const minutes = endDate.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            value += ` ${hours}:${minutes} ${ampm}`;
        }
        
        endPicker.input.value = value;
        
        // Trigger change event on end picker
        endPicker.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    parseDate(str) {
        // Try to parse MM/DD/YYYY hh:mm AM/PM format
        const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?\s*(AM|PM)?/i);
        if (match) {
            const [, month, day, year, hours, minutes, ampm] = match;
            const date = new Date(year, month - 1, day);
            
            if (hours) {
                let h = parseInt(hours);
                if (ampm && ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
                date.setHours(h);
                date.setMinutes(parseInt(minutes) || 0);
            }
            
            return date;
        }
        return null;
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            // Check if we're allowed to open
            if (this.canOpen()) {
                this.open();
            }
        }
    }
    
    open() {
        this.isOpen = true;
        this.picker.classList.add('active');
        
        // Parse the current input value to sync selectedDate before rendering
        // This ensures the time picker opens at the already selected time when editing
        if (this.input.value) {
            const parsed = this.parseDate(this.input.value);
            if (parsed) {
                this.selectedDate = parsed;
                this.currentMonth = new Date(parsed);
            }
        }
        
        this.renderCalendar();
        this.positionPicker();
    }
    
    close() {
        this.isOpen = false;
        this.picker.classList.remove('active');
    }
    
    positionPicker() {
        const rect = this.input.getBoundingClientRect();
        const pickerRect = this.picker.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;
        
        // Adjust if picker would go off screen
        if (left + pickerRect.width > window.innerWidth) {
            left = window.innerWidth - pickerRect.width - 16;
        }
        
        if (top + pickerRect.height > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - pickerRect.height - 8;
        }
        
        this.picker.style.top = `${top}px`;
        this.picker.style.left = `${left}px`;
    }
}

// Initialize date pickers on all date input fields
function initDatePickers() {
    // Event detail modal date fields (read-only in view mode, editable in edit mode)
    const eventStartDate = document.getElementById('eventStartDate');
    const eventEndDate = document.getElementById('eventEndDate');
    
    let eventStartPicker = null;
    let eventEndPicker = null;
    
    if (eventStartDate) {
        eventStartPicker = new DateTimePicker(eventStartDate, { 
            showTime: true,
            isStartDate: true,
            requireEditMode: true  // Only allow editing when in edit mode
        });
    }
    if (eventEndDate) {
        eventEndPicker = new DateTimePicker(eventEndDate, { 
            showTime: true,
            isEndDate: true,
            requireEditMode: true  // Only allow editing when in edit mode
        });
    }
    
    // Link start and end date pickers for event detail modal
    if (eventStartPicker && eventEndPicker) {
        eventStartPicker.linkTo(eventEndPicker);
        eventEndPicker.linkTo(eventStartPicker);
    }
    
    // Add event modal date fields
    const newEventStartDate = document.getElementById('newEventStartDate');
    const newEventEndDate = document.getElementById('newEventEndDate');
    
    let newEventStartPicker = null;
    let newEventEndPicker = null;
    
    if (newEventStartDate) {
        newEventStartPicker = new DateTimePicker(newEventStartDate, { 
            showTime: true,
            isStartDate: true
        });
    }
    if (newEventEndDate) {
        newEventEndPicker = new DateTimePicker(newEventEndDate, { 
            showTime: true,
            isEndDate: true
        });
    }
    
    // Link start and end date pickers for add event modal
    if (newEventStartPicker && newEventEndPicker) {
        newEventStartPicker.linkTo(newEventEndPicker);
        newEventEndPicker.linkTo(newEventStartPicker);
    }
    
    // Add task modal date field (no linking needed, just a single due date)
    const newTaskDueDate = document.getElementById('newTaskDueDate');
    if (newTaskDueDate) {
        new DateTimePicker(newTaskDueDate, { showTime: true });
    }
}

// Initialize date pickers when DOM is ready
document.addEventListener('DOMContentLoaded', initDatePickers);

// ============================================
// Theme Management (Light/Dark Mode)
// ============================================

const ThemeManager = {
    // Storage key for theme preference
    STORAGE_KEY: 'openplanner-theme',
    
    // Available themes
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    },
    
    // Initialize theme on page load
    init() {
        // Apply saved theme immediately to prevent flash
        this.applyTheme(this.getSavedTheme());
        
        // Listen for system preference changes
        this.watchSystemPreference();
        
        // Initialize theme options on settings page
        this.initThemeOptions();
    },
    
    // Get the saved theme preference from localStorage
    getSavedTheme() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && Object.values(this.THEMES).includes(saved)) {
            return saved;
        }
        return this.THEMES.LIGHT; // Default to light
    },
    
    // Save theme preference to localStorage
    saveTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    },
    
    // Get the actual theme to apply (resolves 'system' to 'light' or 'dark')
    getResolvedTheme(theme) {
        if (theme === this.THEMES.SYSTEM) {
            return this.getSystemPreference();
        }
        return theme;
    },
    
    // Get system color scheme preference
    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return this.THEMES.DARK;
        }
        return this.THEMES.LIGHT;
    },
    
    // Apply theme to the document
    applyTheme(theme) {
        const resolvedTheme = this.getResolvedTheme(theme);
        
        if (resolvedTheme === this.THEMES.DARK) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(resolvedTheme);
    },
    
    // Update meta theme-color tag
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === this.THEMES.DARK ? '#0B1120' : '#FFFFFF';
    },
    
    // Set theme and save preference
    setTheme(theme) {
        this.saveTheme(theme);
        this.applyTheme(theme);
        this.updateThemeOptions(theme);
    },
    
    // Watch for system preference changes
    watchSystemPreference() {
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const savedTheme = this.getSavedTheme();
                if (savedTheme === this.THEMES.SYSTEM) {
                    this.applyTheme(this.THEMES.SYSTEM);
                }
            });
        }
    },
    
    // Initialize theme options on settings page
    initThemeOptions() {
        const themeOptions = document.querySelectorAll('.theme-option input[name="theme"]');
        
        if (themeOptions.length === 0) return;
        
        // Set the current theme selection
        const currentTheme = this.getSavedTheme();
        themeOptions.forEach(option => {
            if (option.value === currentTheme) {
                option.checked = true;
            }
            
            // Add change listener
            option.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setTheme(e.target.value);
                }
            });
        });
    },
    
    // Update theme options UI (for when theme is changed elsewhere)
    updateThemeOptions(theme) {
        const themeOptions = document.querySelectorAll('.theme-option input[name="theme"]');
        themeOptions.forEach(option => {
            option.checked = option.value === theme;
        });
    },
    
    // Toggle between light and dark (for quick toggle buttons)
    toggle() {
        const currentTheme = this.getSavedTheme();
        const resolvedCurrent = this.getResolvedTheme(currentTheme);
        const newTheme = resolvedCurrent === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.setTheme(newTheme);
    }
};

// Initialize theme immediately to prevent flash
(function() {
    const savedTheme = localStorage.getItem('openplanner-theme') || 'light';
    if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

// Initialize ThemeManager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// Export for global access
window.ThemeManager = ThemeManager;

// ============================================
// Global Add Syllabus Modal System
// Works on any page with an "Add Syllabus" button
// ============================================

const AddSyllabusModal = {
    selectedColor: '#239BC2',
    
    init() {
        this.injectHTML();
        this.injectStyles();
        this.setupEventListeners();
    },
    
    injectHTML() {
        // Don't inject if already exists
        if (document.getElementById('globalAddSyllabusModal')) return;
        
        const html = `
            <div class="modal-overlay" id="globalAddSyllabusModal">
                <div class="modal-card syllabus-modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Add New <span class="title-accent">Syllabus</span></h2>
                        <button class="modal-close-btn" id="globalCloseSyllabusModal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">
                                Course Title <span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" id="globalSyllabusCourseName" placeholder="Enter Course Title">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Upload Syllabus Here</label>
                            <div class="file-upload-area" id="globalFileUploadArea">
                                <div class="upload-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                </div>
                                <p class="upload-text">Drag and Drop file here or <span class="upload-link">Choose file</span></p>
                                <input type="file" id="globalSyllabusFileInput" accept=".pdf,.doc,.docx,.txt" hidden>
                                <p class="file-name" id="globalSelectedFileName"></p>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">
                                    Class Time <span class="required">*</span>
                                </label>
                                <div class="time-picker-wrapper">
                                    <input type="text" class="form-input" id="globalSyllabusClassTime" placeholder="Select Class Time" readonly>
                                    <div class="time-picker-dropdown" id="globalTimePickerDropdown">
                                        <div class="time-picker-header">Select Time</div>
                                        <div class="time-picker-list" id="globalTimePickerList"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Professor Name</label>
                                <input type="text" class="form-input" id="globalSyllabusProfessor" placeholder="Enter Professor Name">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Course Color</label>
                            <div class="color-picker-container" id="globalColorPicker">
                                <div class="color-preview selected" data-color="#239BC2" style="background-color: #239BC2;"></div>
                                <div class="color-option" data-color="#EF4444" style="background-color: #EF4444;"></div>
                                <div class="color-option" data-color="#F97316" style="background-color: #F97316;"></div>
                                <div class="color-option" data-color="#EAB308" style="background-color: #EAB308;"></div>
                                <div class="color-option" data-color="#22C55E" style="background-color: #22C55E;"></div>
                                <div class="color-option" data-color="#14B8A6" style="background-color: #14B8A6;"></div>
                                <div class="color-option" data-color="#3B82F6" style="background-color: #3B82F6;"></div>
                                <div class="color-option" data-color="#8B5CF6" style="background-color: #8B5CF6;"></div>
                                <div class="color-option" data-color="#EC4899" style="background-color: #EC4899;"></div>
                                <div class="color-option" data-color="#6B7280" style="background-color: #6B7280;"></div>
                                <div class="color-option" data-color="#78716C" style="background-color: #78716C;"></div>
                                <div class="color-option" data-color="#6366F1" style="background-color: #6366F1;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer syllabus-footer">
                        <button class="btn btn-outline" id="globalCancelSyllabusBtn">Cancel</button>
                        <div class="modal-footer-right">
                            <button class="btn btn-outline" id="globalClearSyllabusBtn">Clear</button>
                            <button class="btn btn-primary" id="globalSaveSyllabusBtn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        this.generateTimeOptions();
    },
    
    injectStyles() {
        if (document.getElementById('global-syllabus-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'global-syllabus-modal-styles';
        styles.textContent = `
            #globalAddSyllabusModal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                padding: 1rem;
            }
            #globalAddSyllabusModal.active {
                display: flex;
            }
            #globalAddSyllabusModal .syllabus-modal {
                max-width: 580px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                background: var(--white, #fff);
                border-radius: 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            #globalAddSyllabusModal .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid var(--neutral-200, #e2e8f0);
            }
            #globalAddSyllabusModal .modal-title {
                font-size: 1.375rem;
                font-weight: 700;
                color: var(--neutral-900, #1e293b);
                margin: 0;
            }
            #globalAddSyllabusModal .title-accent {
                color: var(--primary, #239BC2);
            }
            #globalAddSyllabusModal .modal-close-btn {
                background: none;
                border: none;
                color: var(--neutral-500, #64748b);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.375rem;
                transition: all 0.2s;
            }
            #globalAddSyllabusModal .modal-close-btn:hover {
                background: var(--neutral-100, #f1f5f9);
                color: var(--neutral-700, #334155);
            }
            #globalAddSyllabusModal .modal-body {
                padding: 1.5rem;
            }
            #globalAddSyllabusModal .form-group {
                margin-bottom: 1.25rem;
            }
            #globalAddSyllabusModal .form-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--neutral-700, #334155);
                margin-bottom: 0.5rem;
            }
            #globalAddSyllabusModal .required {
                color: #ef4444;
            }
            #globalAddSyllabusModal .form-input {
                width: 100%;
                padding: 0.75rem 1rem;
                font-size: 0.9375rem;
                border: 1px solid var(--neutral-300, #cbd5e1);
                border-radius: 0.5rem;
                background: var(--white, #fff);
                color: var(--neutral-900, #1e293b);
                transition: all 0.2s;
            }
            #globalAddSyllabusModal .form-input:focus {
                outline: none;
                border-color: var(--primary, #239BC2);
                box-shadow: 0 0 0 3px rgba(35, 155, 194, 0.15);
            }
            #globalAddSyllabusModal .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            @media (max-width: 640px) {
                #globalAddSyllabusModal .form-row {
                    grid-template-columns: 1fr;
                }
            }
            #globalAddSyllabusModal .file-upload-area {
                border: 2px dashed var(--primary, #239BC2);
                border-radius: 0.75rem;
                padding: 2rem 1.5rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                background: var(--white, #fff);
            }
            #globalAddSyllabusModal .file-upload-area:hover,
            #globalAddSyllabusModal .file-upload-area.dragover {
                background: rgba(35, 155, 194, 0.05);
                border-color: #1a7a9a;
            }
            #globalAddSyllabusModal .upload-icon {
                width: 48px;
                height: 48px;
                margin: 0 auto 1rem;
                background: rgba(35, 155, 194, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary, #239BC2);
            }
            #globalAddSyllabusModal .upload-text {
                font-size: 0.9375rem;
                color: var(--neutral-600, #475569);
                margin: 0;
            }
            #globalAddSyllabusModal .upload-link {
                color: var(--primary, #239BC2);
                font-weight: 600;
                cursor: pointer;
            }
            #globalAddSyllabusModal .file-name {
                margin-top: 0.75rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: #1a7a9a;
            }
            #globalAddSyllabusModal .time-picker-wrapper {
                position: relative;
            }
            #globalAddSyllabusModal .time-picker-dropdown {
                position: absolute;
                top: calc(100% + 4px);
                left: 0;
                width: 100%;
                max-width: 200px;
                background: var(--white, #fff);
                border: 1px solid var(--neutral-200, #e2e8f0);
                border-radius: 0.75rem;
                box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s;
                overflow: hidden;
            }
            #globalAddSyllabusModal .time-picker-dropdown.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            #globalAddSyllabusModal .time-picker-header {
                padding: 0.875rem 1rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--primary, #239BC2);
                border-bottom: 1px solid var(--neutral-100, #f1f5f9);
                text-align: center;
                background: rgba(35, 155, 194, 0.05);
            }
            #globalAddSyllabusModal .time-picker-list {
                max-height: 240px;
                overflow-y: auto;
                padding: 0.5rem;
            }
            #globalAddSyllabusModal .time-picker-option {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.625rem 0.75rem;
                font-size: 0.875rem;
                color: var(--neutral-600, #475569);
                border-radius: 0.375rem;
                cursor: pointer;
                transition: all 0.15s;
            }
            #globalAddSyllabusModal .time-picker-option:hover {
                background: rgba(35, 155, 194, 0.1);
                color: var(--primary, #239BC2);
            }
            #globalAddSyllabusModal .time-picker-option.selected {
                background: var(--primary, #239BC2);
                color: #fff;
            }
            #globalAddSyllabusModal .color-picker-container {
                display: flex;
                flex-wrap: wrap;
                gap: 0.625rem;
            }
            #globalAddSyllabusModal .color-preview,
            #globalAddSyllabusModal .color-option {
                width: 40px;
                height: 40px;
                border-radius: 0.5rem;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.2s;
            }
            #globalAddSyllabusModal .color-preview:hover,
            #globalAddSyllabusModal .color-option:hover {
                transform: scale(1.1);
            }
            #globalAddSyllabusModal .color-preview.selected,
            #globalAddSyllabusModal .color-option.selected {
                border-color: var(--neutral-900, #1e293b);
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--neutral-400, #94a3b8);
            }
            #globalAddSyllabusModal .modal-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                border-top: 1px solid var(--neutral-200, #e2e8f0);
                background: var(--neutral-50, #f8fafc);
                border-radius: 0 0 1rem 1rem;
            }
            #globalAddSyllabusModal .modal-footer-right {
                display: flex;
                gap: 0.75rem;
            }
            #globalAddSyllabusModal .btn {
                padding: 0.625rem 1.25rem;
                font-size: 0.875rem;
                font-weight: 600;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            #globalAddSyllabusModal .btn-outline {
                background: var(--white, #fff);
                color: var(--neutral-600, #475569);
                border: 1px solid var(--neutral-300, #cbd5e1);
            }
            #globalAddSyllabusModal .btn-outline:hover {
                background: var(--neutral-100, #f1f5f9);
                border-color: var(--neutral-400, #94a3b8);
            }
            #globalAddSyllabusModal .btn-primary {
                background: var(--primary, #239BC2);
                color: #fff;
            }
            #globalAddSyllabusModal .btn-primary:hover {
                background: #1a7a9a;
            }
            /* Dark mode */
            [data-theme="dark"] #globalAddSyllabusModal .syllabus-modal {
                background: var(--white, #1e293b);
            }
            [data-theme="dark"] #globalAddSyllabusModal .modal-header {
                border-bottom-color: var(--neutral-200, #334155);
            }
            [data-theme="dark"] #globalAddSyllabusModal .modal-title {
                color: var(--neutral-900, #f1f5f9);
            }
            [data-theme="dark"] #globalAddSyllabusModal .form-label {
                color: var(--neutral-700, #cbd5e1);
            }
            [data-theme="dark"] #globalAddSyllabusModal .form-input {
                background: var(--neutral-100, #0f172a);
                border-color: var(--neutral-200, #334155);
                color: var(--neutral-900, #f1f5f9);
            }
            [data-theme="dark"] #globalAddSyllabusModal .file-upload-area {
                background: var(--neutral-100, #0f172a);
            }
            [data-theme="dark"] #globalAddSyllabusModal .time-picker-dropdown {
                background: var(--white, #1e293b);
                border-color: var(--neutral-200, #334155);
            }
            [data-theme="dark"] #globalAddSyllabusModal .modal-footer {
                background: var(--neutral-100, #0f172a);
                border-top-color: var(--neutral-200, #334155);
            }
        `;
        document.head.appendChild(styles);
    },
    
    generateTimeOptions() {
        const timePickerList = document.getElementById('globalTimePickerList');
        if (!timePickerList) return;
        
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                const ampm = hour < 12 ? 'AM' : 'PM';
                const timeStr = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
                times.push(timeStr);
            }
        }
        
        timePickerList.innerHTML = times.map(time => 
            `<div class="time-picker-option" data-time="${time}">${time}</div>`
        ).join('');
    },
    
    setupEventListeners() {
        const modal = document.getElementById('globalAddSyllabusModal');
        if (!modal) return;
        
        const closeBtn = document.getElementById('globalCloseSyllabusModal');
        const cancelBtn = document.getElementById('globalCancelSyllabusBtn');
        const clearBtn = document.getElementById('globalClearSyllabusBtn');
        const saveBtn = document.getElementById('globalSaveSyllabusBtn');
        const fileUploadArea = document.getElementById('globalFileUploadArea');
        const fileInput = document.getElementById('globalSyllabusFileInput');
        const classTimeInput = document.getElementById('globalSyllabusClassTime');
        const timePickerDropdown = document.getElementById('globalTimePickerDropdown');
        const timePickerList = document.getElementById('globalTimePickerList');
        const colorPicker = document.getElementById('globalColorPicker');
        
        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Time picker
        if (classTimeInput && timePickerDropdown) {
            classTimeInput.addEventListener('click', (e) => {
                e.stopPropagation();
                timePickerDropdown.classList.add('active');
                
                // Scroll to 8:00 AM by default
                const timeList = document.getElementById('globalTimePickerList');
                if (timeList) {
                    const eightAmOption = timeList.querySelector('[data-time="8:00 AM"]');
                    if (eightAmOption) {
                        eightAmOption.scrollIntoView({ block: 'start' });
                    }
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!classTimeInput.contains(e.target) && !timePickerDropdown.contains(e.target)) {
                    timePickerDropdown.classList.remove('active');
                }
            });
        }
        
        if (timePickerList) {
            timePickerList.addEventListener('click', (e) => {
                const option = e.target.closest('.time-picker-option');
                if (option) {
                    const time = option.dataset.time;
                    document.getElementById('globalSyllabusClassTime').value = time;
                    timePickerList.querySelectorAll('.time-picker-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    timePickerDropdown.classList.remove('active');
                }
            });
        }
        
        // File upload
        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', () => {
                const fileName = document.getElementById('globalSelectedFileName');
                if (fileInput.files.length > 0 && fileName) {
                    fileName.textContent = fileInput.files[0].name;
                }
            });
            
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });
            
            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('dragover');
            });
            
            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    const fileName = document.getElementById('globalSelectedFileName');
                    if (fileName) fileName.textContent = files[0].name;
                }
            });
        }
        
        // Color picker
        if (colorPicker) {
            colorPicker.addEventListener('click', (e) => {
                const option = e.target.closest('.color-preview, .color-option');
                if (option) {
                    colorPicker.querySelectorAll('.color-preview, .color-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    this.selectedColor = option.dataset.color;
                }
            });
        }
        
        // Clear form
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }
        
        // Save
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.save());
        }
        
        // Setup "Add Syllabus" buttons on the page
        this.setupAddButtons();
    },
    
    setupAddButtons() {
        // Find all "Add Syllabus" buttons and attach click handler
        document.querySelectorAll('.btn-accent').forEach(btn => {
            if (btn.textContent.includes('Add Syllabus')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            }
        });
    },
    
    open() {
        const modal = document.getElementById('globalAddSyllabusModal');
        if (modal) {
            this.clearForm();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    close() {
        const modal = document.getElementById('globalAddSyllabusModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    clearForm() {
        const courseName = document.getElementById('globalSyllabusCourseName');
        const classTime = document.getElementById('globalSyllabusClassTime');
        const professor = document.getElementById('globalSyllabusProfessor');
        const fileName = document.getElementById('globalSelectedFileName');
        const fileInput = document.getElementById('globalSyllabusFileInput');
        const colorPicker = document.getElementById('globalColorPicker');
        const timePickerList = document.getElementById('globalTimePickerList');
        
        if (courseName) courseName.value = '';
        if (classTime) classTime.value = '';
        if (professor) professor.value = '';
        if (fileName) fileName.textContent = '';
        if (fileInput) fileInput.value = '';
        
        // Reset color
        if (colorPicker) {
            colorPicker.querySelectorAll('.color-preview, .color-option').forEach(opt => opt.classList.remove('selected'));
            const defaultColor = colorPicker.querySelector('[data-color="#239BC2"]');
            if (defaultColor) defaultColor.classList.add('selected');
        }
        this.selectedColor = '#239BC2';
        
        // Reset time picker
        if (timePickerList) {
            timePickerList.querySelectorAll('.time-picker-option').forEach(opt => opt.classList.remove('selected'));
        }
    },
    
    save() {
        const courseName = document.getElementById('globalSyllabusCourseName')?.value || '';
        const classTime = document.getElementById('globalSyllabusClassTime')?.value || '';
        const professor = document.getElementById('globalSyllabusProfessor')?.value || '';
        const fileInput = document.getElementById('globalSyllabusFileInput');
        
        if (!courseName.trim()) {
            alert('Please enter a course title');
            return;
        }
        
        if (!classTime.trim()) {
            alert('Please select a class time');
            return;
        }
        
        // Close the modal
        this.close();
        
        // Start upload using global notification system
        const fileName = fileInput?.files[0] ? fileInput.files[0].name : null;
        if (window.UploadNotification) {
            window.UploadNotification.start(fileName, courseName, {
                classTime: classTime,
                professor: professor,
                colorHex: this.selectedColor
            });
        }
    }
};

// ============================================
// Global Upload Notification System
// Persists across page navigation
// ============================================

const UploadNotification = {
    STORAGE_KEY: 'openplanner-upload-state',
    intervalId: null,
    
    // Initialize - inject HTML and check for ongoing uploads
    init() {
        this.injectHTML();
        this.injectStyles();
        this.checkOngoingUpload();
        this.renderNewCourses();
    },
    
    // Inject the notification HTML into the page
    injectHTML() {
        // Don't inject if already exists
        if (document.getElementById('uploadProgressOverlay')) return;
        
        const html = `
            <div class="upload-progress-overlay" id="uploadProgressOverlay" style="position:fixed; bottom:24px; right:24px; z-index:99999;">
                <div class="upload-progress-card" style="position:relative; background:#fff; padding:16px 20px; border-radius:16px; width:320px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <button class="upload-close-btn" id="uploadCloseBtn" title="Dismiss" style="position:absolute; top:8px; right:8px; background:none; border:none; cursor:pointer; color:#94A3B8; padding:4px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                    
                    <div class="upload-card-header" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div class="upload-spinner" id="uploadSpinner" style="width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#239BC2; border-radius:50%; animation:uploadSpin 1s linear infinite;"></div>
                        <div class="upload-complete-icon" id="uploadCompleteIcon" style="width:32px; height:32px; background:#DCFCE7; border-radius:50%; display:none; align-items:center; justify-content:center; color:#22C55E;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:16px; height:16px;">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <div class="upload-header-info" style="flex:1; min-width:0;">
                            <h3 id="uploadTitle" style="font-size:14px; font-weight:600; color:#1E293B; margin:0 0 2px 0;">Uploading Syllabus</h3>
                            <p id="uploadingFileName" style="font-size:12px; color:#64748B; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">syllabus.pdf</p>
                        </div>
                    </div>
                    
                    <div style="background:#E2E8F0; border-radius:9999px; height:6px; overflow:hidden; margin:8px 0;">
                        <div class="progress-bar" id="uploadProgressBar" style="background:linear-gradient(90deg, #239BC2, #14B8A6); height:100%; width:0%; border-radius:9999px; transition:width 0.15s;"></div>
                    </div>
                    
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <p id="uploadProgressText" style="font-size:12px; color:#64748B; margin:0;">Preparing upload...</p>
                        <p id="progressPercentage" style="font-size:12px; font-weight:600; color:#239BC2; margin:0;">0%</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Setup close button
        const closeBtn = document.getElementById('uploadCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.cancel());
        }
    },
    
    // Inject required CSS
    injectStyles() {
        if (document.getElementById('upload-notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'upload-notification-styles';
        styles.textContent = `
            @keyframes uploadSpin {
                to { transform: rotate(360deg); }
            }
            #uploadProgressOverlay {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0s 0.3s, opacity 0.3s ease;
            }
            #uploadProgressOverlay.active {
                visibility: visible !important;
                opacity: 1 !important;
                transition: visibility 0s, opacity 0.3s ease;
            }
            #uploadProgressOverlay .upload-progress-card {
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            #uploadProgressOverlay.active .upload-progress-card {
                transform: translateY(0);
            }
            #uploadProgressOverlay .upload-close-btn:hover {
                background: #F1F5F9;
                border-radius: 4px;
            }
            [data-theme="dark"] #uploadProgressOverlay .upload-progress-card {
                background: #1E293B !important;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            }
            [data-theme="dark"] #uploadProgressOverlay #uploadTitle {
                color: #F1F5F9 !important;
            }
            [data-theme="dark"] #uploadProgressOverlay #uploadingFileName,
            [data-theme="dark"] #uploadProgressOverlay #uploadProgressText {
                color: #94A3B8 !important;
            }
            [data-theme="dark"] #uploadProgressOverlay .upload-close-btn {
                color: #64748B;
            }
            [data-theme="dark"] #uploadProgressOverlay .upload-close-btn:hover {
                background: #334155;
            }
        `;
        document.head.appendChild(styles);
    },
    
    // Start a new upload simulation with full course data
    start(fileName, courseName, courseData = {}) {
        const startTime = Date.now();
        const duration = 15000; // 15 seconds
        
        // Generate a URL-safe course ID from the name
        const courseId = courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        // Get color class from hex
        const colorHex = courseData.colorHex || '#239BC2';
        const colorClass = colorHexToClass[colorHex] || 'cyan';
        const colorNames = {
            '#239BC2': 'Cyan', '#EF4444': 'Red', '#F97316': 'Orange', '#EAB308': 'Yellow',
            '#22C55E': 'Green', '#14B8A6': 'Teal', '#3B82F6': 'Blue', '#8B5CF6': 'Purple',
            '#EC4899': 'Pink', '#6B7280': 'Gray', '#78716C': 'Stone', '#6366F1': 'Indigo', '#cddc39': 'Lime'
        };
        
        // Save state to localStorage
        const state = {
            fileName: fileName || courseName + '_syllabus.pdf',
            courseName: courseName,
            courseId: courseId,
            startTime: startTime,
            duration: duration,
            completed: false,
            courseCreated: false,
            courseData: {
                title: courseName,
                professor: courseData.professor || '',
                classTime: courseData.classTime || '',
                syllabus: fileName || courseName + '_syllabus.pdf',
                colorHex: colorHex,
                colorName: colorNames[colorHex] || 'Cyan',
                colorClass: colorClass
            }
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        
        // Start the animation
        this.resumeUpload(state);
    },
    
    // Check if there's an ongoing upload and resume it
    checkOngoingUpload() {
        const stateStr = localStorage.getItem(this.STORAGE_KEY);
        if (!stateStr) return;
        
        try {
            const state = JSON.parse(stateStr);
            if (state.completed) {
                // Show completed state briefly then clear
                this.showCompleted(state);
                setTimeout(() => this.clear(), 3000);
            } else {
                // Resume the upload
                this.resumeUpload(state);
            }
        } catch (e) {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    },
    
    // Resume an upload in progress
    resumeUpload(state) {
        const overlay = document.getElementById('uploadProgressOverlay');
        const progressBar = document.getElementById('uploadProgressBar');
        const progressText = document.getElementById('uploadProgressText');
        const progressPercentage = document.getElementById('progressPercentage');
        const uploadTitle = document.getElementById('uploadTitle');
        const uploadSpinner = document.getElementById('uploadSpinner');
        const uploadCompleteIcon = document.getElementById('uploadCompleteIcon');
        const uploadingFileName = document.getElementById('uploadingFileName');
        
        if (!overlay) return;
        
        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        // Reset UI state
        if (uploadSpinner) uploadSpinner.style.display = 'block';
        if (uploadCompleteIcon) uploadCompleteIcon.style.display = 'none';
        if (uploadTitle) uploadTitle.textContent = 'Uploading Syllabus';
        if (uploadingFileName) uploadingFileName.textContent = state.fileName;
        
        // Show the overlay
        overlay.classList.add('active');
        
        const statusMessages = [
            { threshold: 0, text: 'Uploading...' },
            { threshold: 20, text: 'Processing syllabus...' },
            { threshold: 45, text: 'Extracting events...' },
            { threshold: 70, text: 'Analyzing schedule...' },
            { threshold: 90, text: 'Finalizing...' }
        ];
        
        const updateProgress = () => {
            const elapsed = Date.now() - state.startTime;
            let progress = Math.min((elapsed / state.duration) * 100, 100);
            
            // Update progress bar and percentage
            if (progressBar) progressBar.style.width = progress + '%';
            if (progressPercentage) progressPercentage.textContent = Math.round(progress) + '%';
            
            // Update status message
            for (let i = statusMessages.length - 1; i >= 0; i--) {
                if (progress >= statusMessages[i].threshold) {
                    if (progressText) progressText.textContent = statusMessages[i].text;
                    break;
                }
            }
            
            if (progress >= 100) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                
                // Mark as completed in storage
                state.completed = true;
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
                
                // Show success state
                this.showCompleted(state);
                
                // Auto-hide after 3 seconds
                setTimeout(() => this.clear(), 3000);
            }
        };
        
        // Run immediately and then every 100ms
        updateProgress();
        this.intervalId = setInterval(updateProgress, 100);
    },
    
    // Show completed state and create the course
    showCompleted(state) {
        const overlay = document.getElementById('uploadProgressOverlay');
        const progressBar = document.getElementById('uploadProgressBar');
        const progressText = document.getElementById('uploadProgressText');
        const progressPercentage = document.getElementById('progressPercentage');
        const uploadTitle = document.getElementById('uploadTitle');
        const uploadSpinner = document.getElementById('uploadSpinner');
        const uploadCompleteIcon = document.getElementById('uploadCompleteIcon');
        
        if (!overlay) return;
        
        overlay.classList.add('active');
        
        if (progressBar) progressBar.style.width = '100%';
        if (uploadSpinner) uploadSpinner.style.display = 'none';
        if (uploadCompleteIcon) uploadCompleteIcon.style.display = 'flex';
        if (uploadTitle) uploadTitle.textContent = 'Upload Complete!';
        if (progressText) progressText.textContent = 'Course created successfully';
        if (progressPercentage) progressPercentage.textContent = '✓';
        
        // Create the course if not already created
        if (state.courseData && !state.courseCreated) {
            this.createCourse(state);
        }
    },
    
    // Create the course in globalCourseDetails
    createCourse(state) {
        const courseId = state.courseId;
        const courseData = state.courseData;
        
        // Add to globalCourseDetails
        if (typeof globalCourseDetails !== 'undefined') {
            globalCourseDetails[courseId] = courseData;
            
            // Save to localStorage
            if (typeof saveCourseDetailsToStorage === 'function') {
                saveCourseDetailsToStorage();
            }
            
            // Track this as a user-created course
            let userCourses = JSON.parse(localStorage.getItem('openplanner-user-courses') || '[]');
            if (!userCourses.includes(courseId)) {
                userCourses.push(courseId);
                localStorage.setItem('openplanner-user-courses', JSON.stringify(userCourses));
            }
            
            // If we're on the courses page, add the card
            this.addCourseCardToPage(courseId, courseData);
            
            // Mark as created in state
            state.courseCreated = true;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('courseCreated', { detail: { courseId, courseData } }));
        }
    },
    
    // Add a course card to the courses page (if on that page)
    addCourseCardToPage(courseId, courseData) {
        const coursesGrid = document.querySelector('.courses-grid');
        if (!coursesGrid) return; // Not on courses page
        
        // Check if card already exists
        if (document.querySelector(`.course-card[data-course-id="${courseId}"]`)) return;
        
        const colorClass = courseData.colorClass || 'cyan';
        const colorHex = courseData.colorHex || '#239BC2';
        const displayName = courseData.title.length > 20 
            ? courseData.title.substring(0, 20) + '...' 
            : courseData.title;
        
        const cardHTML = `
            <div class="course-card" data-course-id="${courseId}" onclick="window.location.href='edit-course.html?course=${courseId}'" style="cursor: pointer;">
                <div class="course-banner ${colorClass}">
                    <div class="course-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            <line x1="8" y1="7" x2="16" y2="7"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                    </div>
                </div>
                <div class="course-content">
                    <h3 class="course-name">${displayName}</h3>
                    <div class="course-meta">
                        <div class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>${courseData.classTime || 'No time set'}</span>
                        </div>
                        <div class="meta-item color-tag">
                            <span class="color-swatch ${colorClass}" style="background-color: ${colorHex};"></span>
                            <span>${colorHex}</span>
                        </div>
                    </div>
                    <div class="course-footer">
                        <div class="event-count">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                            <span>Event: <strong>0</strong></span>
                        </div>
                        <button class="delete-course-btn" onclick="event.stopPropagation(); deleteCourse('${courseId}', this);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add with animation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML.trim();
        const newCard = tempDiv.firstChild;
        newCard.style.opacity = '0';
        newCard.style.transform = 'scale(0.9)';
        coursesGrid.appendChild(newCard);
        
        // Trigger animation
        requestAnimationFrame(() => {
            newCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            newCard.style.opacity = '1';
            newCard.style.transform = 'scale(1)';
        });
    },
    
    // Render any user-created courses on page load (for courses page)
    renderNewCourses() {
        const coursesGrid = document.querySelector('.courses-grid');
        if (!coursesGrid) return; // Not on courses page
        
        const userCourses = JSON.parse(localStorage.getItem('openplanner-user-courses') || '[]');
        
        userCourses.forEach(courseId => {
            if (typeof globalCourseDetails !== 'undefined' && globalCourseDetails[courseId]) {
                // Check if it's not one of the default courses (those are already in HTML)
                const defaultCourses = ['analytics', 'marketing', 'finance', 'history', 'accounting'];
                if (!defaultCourses.includes(courseId)) {
                    this.addCourseCardToPage(courseId, globalCourseDetails[courseId]);
                }
            }
        });
    },
    
    // Cancel the upload
    cancel() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.clear();
    },
    
    // Clear the upload state and hide
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        const overlay = document.getElementById('uploadProgressOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
};

// Global function to delete a user-created course
function deleteCourse(courseId, buttonElement) {
    if (typeof showDeleteConfirm === 'function') {
        showDeleteConfirm('Delete Course', function() {
            // Remove from globalCourseDetails
            if (typeof globalCourseDetails !== 'undefined') {
                delete globalCourseDetails[courseId];
                if (typeof saveCourseDetailsToStorage === 'function') {
                    saveCourseDetailsToStorage();
                }
            }
            
            // Remove from user courses list
            let userCourses = JSON.parse(localStorage.getItem('openplanner-user-courses') || '[]');
            userCourses = userCourses.filter(id => id !== courseId);
            localStorage.setItem('openplanner-user-courses', JSON.stringify(userCourses));
            
            // Animate and remove the card
            const card = buttonElement.closest('.course-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => card.remove(), 200);
            }
        });
    } else {
        // Fallback if showDeleteConfirm doesn't exist
        if (confirm('Are you sure you want to delete this course?')) {
            if (typeof globalCourseDetails !== 'undefined') {
                delete globalCourseDetails[courseId];
                if (typeof saveCourseDetailsToStorage === 'function') {
                    saveCourseDetailsToStorage();
                }
            }
            
            let userCourses = JSON.parse(localStorage.getItem('openplanner-user-courses') || '[]');
            userCourses = userCourses.filter(id => id !== courseId);
            localStorage.setItem('openplanner-user-courses', JSON.stringify(userCourses));
            
            const card = buttonElement.closest('.course-card');
            if (card) card.remove();
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AddSyllabusModal.init();
    UploadNotification.init();
});

// Export for global access
window.AddSyllabusModal = AddSyllabusModal;
window.UploadNotification = UploadNotification;
