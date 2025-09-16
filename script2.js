




//for calander
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventsContainer = document.querySelector(".events"),
  eventDate = document.querySelector(".event-date"),
  addEventSubmit = document.querySelector(".add-event-btn ");
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let selectedDay = null;
let selectedMonth = null;
let selectedYear = null;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//default event array

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  getEventsForMonth(year, month).then(monthEvents => {
    let days = "";

    for (let x = day; x > 0; x--) {
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const hasEvent = monthEvents.some(event => event.event_date === dateStr);

      const isToday =
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth();

      const isSelected =
        selectedDay === i &&
        selectedMonth === month &&
        selectedYear === year;

      let classes = "day";
      if (isToday) {
        classes += " today active";
        activeDay = i;
        getActiveDay(i);
        updateEvents(i);
      } else if (isSelected) {
        classes += " active";
        activeDay = i;
        getActiveDay(i);
        updateEvents(i);
      }

      if (hasEvent) {
        classes += " event";
      }

      days += `<div class="${classes}">${i}</div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
    addListner();
  });
}
initCalendar()
function getEventsForMonth(year, month) {
  return fetch("load_events.php")
    .then(res => res.json())
    .then(data => {
      // Filter only events for the current month and year
      return data.filter(event => {
        const [eventYear, eventMonth] = event.event_date.split("-").map(Number);
        return eventYear === year && eventMonth === month + 1;
      });
    });
}




//function to add month and year on prev and next button
//prev month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}
//next month
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}
//add eventlistnner on prev and next 
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);
//calander ready

//now aI am gone add goto date and goto today functionality


todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  // only allow numbers and slashes
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

  // automatically insert slashes after MM and DD
  if (dateInput.value.length === 2 && !dateInput.value.includes("/")) {
    dateInput.value += "/";
  }
  if (dateInput.value.length === 5 && dateInput.value.split("/").length < 3) {
    dateInput.value += "/";
  }

  // restrict to MM/DD/YYYY (10 characters including slashes)
  if (dateInput.value.length > 10) {
    dateInput.value = dateInput.value.slice(0, 10);
  }

  // handle backspace just after a slash to remove it too
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3 || dateInput.value.length === 6) {
      dateInput.value = dateInput.value.slice(0, dateInput.value.length - 1);
    }
  }
});



gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 3) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1] > 0 && dateArr[1] < 32 &&  dateArr[2].length === 4) {
      selectedDay = parseInt(dateArr[1]);
      selectedMonth = parseInt(dateArr[0]) - 1;
      selectedYear = parseInt(dateArr[2]);
      month = selectedMonth;  
      year = selectedYear;    
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

const addEventBtn = document.querySelector(".add-event"),
  addEventContainer = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => { 
  if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
    addEventContainer.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});


addEventFrom.addEventListener("input", (e) => {
  let value = addEventFrom.value.replace(/[^0-9:]/g, "");

  if (e.inputType === "deleteContentBackward") {
    // Clean up dangling colon
    if (value.length === 3 && value.endsWith(":")) {
      value = value.slice(0, 2);
    }
  } else {
    // Auto-insert colon after HH
    if (value.length === 2) {
      value += ":";
    }
  }

  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  addEventFrom.value = value;
});
addEventTo.addEventListener("input", (e) => {
  let value = addEventTo.value.replace(/[^0-9:]/g, "");

  if (e.inputType === "deleteContentBackward") {
    // Clean up dangling colon
    if (value.length === 3 && value.endsWith(":")) {
      value = value.slice(0, 2);
    }
  } else {
    // Auto-insert colon after HH
    if (value.length === 2) {
      value += ":";
    }
  }

  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  addEventTo.value = value;
});

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // Set the clicked day
      activeDay = Number(e.target.innerHTML);

      // Remove active class from all days
      days.forEach((day) => {
        day.classList.remove("active");
      });

      // Check if it's a prev or next date and switch month accordingly
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const newDays = document.querySelectorAll(".day");
          newDays.forEach((day) => {
            if (!day.classList.contains("prev-date") && Number(day.innerHTML) === activeDay) {
              day.classList.add("active");
              getActiveDay(activeDay);
              updateEvents(activeDay);
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const newDays = document.querySelectorAll(".day");
          newDays.forEach((day) => {
            if (!day.classList.contains("next-date") && Number(day.innerHTML) === activeDay) {
              day.classList.add("active");
              getActiveDay(activeDay);
              updateEvents(activeDay);
            }
          });
        }, 100);
      } else {
        // Normal day clicked
        e.target.classList.add("active");
        getActiveDay(activeDay);
        updateEvents(activeDay);
      }
    });
  });
}
//lets show active day events and date at the top
  

//function get active day day name and date and update eventday eventdate

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
  const visibleDateInput = document.querySelector(".event-date-visible");
  if (visibleDateInput) {
    visibleDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
  } else {
    console.warn("Visible date input not found");
  }

}
//function update events when a day is active
function updateEvents(day) {
  const visibleDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  fetch("load_events.php")
    .then(res => res.json())
    .then(data => {
      const eventsForDay = data.filter(event => event.event_date === visibleDate);

      eventsContainer.innerHTML = "";

      if (eventsForDay.length === 0) {
        eventsContainer.innerHTML = `<div class="no-event">No Events</div>`;
        return;
      }

      eventsForDay.forEach(event => {
        const timeFrom = convertTime(event.time_from);
        const timeTo = convertTime(event.time_to);

        const eventHTML = `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="time">
              <span class="event-time">${timeFrom} - ${timeTo}</span>
            </div>
          </div>
        `;
        eventsContainer.insertAdjacentHTML("beforeend", eventHTML);
      });
    })
    .catch(err => {
      console.error("Failed to load events:", err);
    });
}



//lets creat function to add events

document.querySelector(".add-event-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent page reload

  const eventTitle = document.querySelector(".event-name").value;
  const eventTimeFrom = document.querySelector(".event-time-from").value;
  const eventTimeTo = document.querySelector(".event-time-to").value;
  const eventDate = document.querySelector(".event-date-visible").value;

  if (!eventTitle || !eventTimeFrom || !eventTimeTo || !eventDate) {
    alert("Please fill all the fields");
    return;
  }

  // Validate time format (24-hour)
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 || timeToArr.length !== 2 ||
    timeFromArr[0] > 23 || timeFromArr[1] > 59 ||
    timeToArr[0] > 23 || timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  // Send data to PHP using fetch
  fetch("save_event.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `eventName=${encodeURIComponent(eventTitle)}&eventTimeFrom=${encodeURIComponent(eventTimeFrom)}&eventTimeTo=${encodeURIComponent(eventTimeTo)}&eventDate=${encodeURIComponent(eventDate)}`
  })
  .then(response => response.text())
  .then(data => {
    console.log("Server response:", data);
    alert(data); // Show success message

    // Convert time for display
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);
    const newEvent = {
      title: eventTitle,
      time: `${timeFrom} - ${timeTo}`,
    };
// Parse eventDate to get day
  const [yearStr, monthStr, dayStr] = eventDate.split("-");
  const eventDay = parseInt(dayStr, 10);

  // Update calendar UI by re-fetching from DB
  updateEvents(eventDay);

  const dayElem = document.querySelector(".day.active");
  if (dayElem && !dayElem.classList.contains("event")) {
    dayElem.classList.add("event");
  }

  // Clear form fields
  document.querySelector(".event-name").value = "";
  document.querySelector(".event-time-from").value = "";
  document.querySelector(".event-time-to").value = "";

  // Close the form container
  document.querySelector(".add-event-wrapper").classList.remove("active");


});







//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  const eventEl = e.target.closest(".event");
  if (eventEl) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = eventEl.querySelector(".event-title").innerText;
      const eventDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(activeDay).padStart(2, "0")}`;

      fetch("delete_event.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `eventTitle=${encodeURIComponent(eventTitle)}&eventDate=${encodeURIComponent(eventDate)}`
      })
      .then(res => res.text())
      .then(data => {
        alert(data);
        updateEvents(activeDay);      // Refresh visible events
        initCalendar();         // Refresh calendar dots
      })
      .catch(err => {
        console.error("Delete failed:", err);
        alert("Something went wrong while deleting the event.");
      });
    }
  }
});






//function to save events in local storage


//function to get events from local storage


function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}



