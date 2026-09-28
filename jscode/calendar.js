/* =========================================
   PROJECT CALENDAR JAVASCRIPT
========================================= */

const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");


/* =========================================
   CURRENT CALENDAR DATE
========================================= */

let currentDate = new Date(2026, 8, 1);
// September 2026


/* =========================================
   TODAY
   Based on your original calendar:
   September 13, 2026
========================================= */

const today = new Date(2026, 8, 13);


/* =========================================
   PROJECT DEADLINES
========================================= */

const deadlines = {

    "2026-05-25": {
        task: "Login Page",
        description: "Design login screen",
        status: "To Do"
    },

    "2026-05-26": {
        task: "Database Setup",
        description: "Create database schema",
        status: "To Do"
    },

    "2026-05-30": {
        task: "Research",
        description: "Gather requirements",
        status: "To Do"
    },

    "2026-06-10": {
        task: "API Development",
        description: "Build REST endpoints",
        status: "In Progress"
    },

    "2026-06-15": {
        task: "Frontend Testing",
        description: "Test UI components",
        status: "To Do"
    },

    "2026-06-20": {
        task: "Deployment",
        description: "Deploy to production",
        status: "To Do"
    }

};


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(year, month, day) {

    return (
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


/* =========================================
   RENDER CALENDAR
========================================= */

function renderCalendar() {

    calendarGrid.innerHTML = "";


    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();


    const monthName =
        currentDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    monthYear.textContent =
        `${monthName} ${year}`;


    /* First day of month */

    const firstDay =
        new Date(year, month, 1).getDay();


    /* Number of days */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* Empty spaces before first day */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "calendar-day empty";

        calendarGrid.appendChild(
            emptyDay
        );

    }


    /* Create days */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            formatDate(
                year,
                month,
                day
            );


        const dayElement =
            document.createElement("div");

        dayElement.className =
            "calendar-day";


        /* TODAY */

        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        /* DEADLINE */

        if (deadlines[date]) {

            dayElement.classList.add(
                "has-deadline"
            );

        }


        /* Day number */

        const number =
            document.createElement("span");

        number.className =
            "day-number";

        number.textContent = day;


        dayElement.appendChild(
            number
        );


        /* Deadline label */

        if (deadlines[date]) {

            const deadline =
                document.createElement("span");

            deadline.className =
                "deadline-label";

            deadline.textContent =
                deadlines[date].task;

            dayElement.appendChild(
                deadline
            );


            /* Click deadline */

            dayElement.addEventListener(
                "click",
                function () {

                    alert(
                        deadlines[date].task +
                        "\n\n" +
                        deadlines[date].description +
                        "\n\nStatus: " +
                        deadlines[date].status
                    );

                }
            );

        }


        calendarGrid.appendChild(
            dayElement
        );

    }

}


/* =========================================
   PREVIOUS MONTH
========================================= */

previousMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


/* =========================================
   NEXT MONTH
========================================= */

nextMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


/* =========================================
   INITIALIZE
========================================= */

renderCalendar();