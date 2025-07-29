
function openDialog() {
    let form = document.querySelector("#signinDialog form"); 
    form.reset();
    
    document.getElementById("signinDialog").showModal(); 
}
document.addEventListener("DOMContentLoaded", () => {
  const registerLink = document.getElementById("link1");
  const registerDialog = document.getElementById("registerDialog");
  const signinDialog = document.getElementById("signinDialog");

  registerLink.addEventListener("click", () => {
    // Close Sign-In if it's open
    if (signinDialog.open) signinDialog.close();

    // Then open Register dialog
    registerDialog.showModal();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const registerLink = document.getElementById("link2");
  const registerDialog = document.getElementById("registerDialog");
  const signinDialog = document.getElementById("signinDialog");

  registerLink.addEventListener("click", () => {
    // Close Sign-In if it's open
    if (registerDialog.open)registerDialog.close();

    // Then open Register dialog
    signinDialog.showModal();
  });
});

document.querySelectorAll(".toggle-password").forEach((toggle) => {
    // Insert eye-slash icon
    toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = toggle.querySelector("i");

      if (input) {
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";

        // Toggle icon class
        if (isVisible) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  });
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const dialog = document.getElementById(targetId);
    if (dialog && dialog.open) dialog.close();
  });
});









document.getElementById('confirmPassword').addEventListener('input', function () {
  const password = document.getElementById('password').value;
  const confirmPassword = this.value;
  const messageEl = document.getElementById('passwordMatchMessage');

  if (confirmPassword === password) {
    messageEl.textContent = '✅ Passwords match';
    messageEl.style.color = 'green';
  } else {
    messageEl.textContent = '❌ Passwords do not match';
    messageEl.style.color = 'red';
  }
});
document.querySelector('form').addEventListener('submit', function (event) {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    event.preventDefault(); // Stop the form from submitting
    alert('Passwords do not match! Please fix it before submitting.');
  }
});



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

const eventsArr = [];
getEvents();
//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;
  
  //update date top of calander
  date.innerHTML = months[month] + " " + year;

  //adding days on dom
  let days = "";
   //prev month days
   for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  //current month days
  for(let i = 1; i <= lastDate; i++){
    //check if event present on current day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if(
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ){
        //if event found
        event = true;
      }
    })
    //if day is today add class today
    if(
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
    ){ 
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      //if event found add also event class also today
       //add active on today at start up
        if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    }
    else if(
       selectedDay !== null &&
       selectedMonth !== null &&
       selectedYear !== null &&
       i === selectedDay &&
       year === selectedYear &&
       month === selectedMonth



    ){ 
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      //if event found add also event class also on selected day
       //add active on selected day at start up
        if (event) {
        days += `<div class="day  active event">${i}</div>`;
      } else {
        days += `<div class="day  active">${i}</div>`;
      }
    }
    //add remaining as it is
    else{
        if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }
  //add nex month days
  for(let j = 1; j <= nextDays; j++){
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  //add listner after calander initialized
  addListner();
}
initCalendar();

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
}
//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  //save events when new one add
  saveEvents();
  
}

//lets creat function to add events

addEventSubmit.addEventListener("click",() => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }
   //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  const newEvent = {
    title : eventTitle,
    time: timeFrom + " - " + timeTo,
  };

  let eventAdded = false;

  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }
  //if event array emty or current day has no evnt creat new
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }
//remove active from add event form
  addEventContainer.classList.remove("active");
  //clear the field
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  //show current added event
  updateEvents(activeDay);
  //also add event class to newly added day if not alrady
  const activeDayElem = document.querySelector(".day.active");
  if(!activeDayElem.classList.contains("event")){
    activeDayElem.classList.add("event");
  }
});


//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);//remove one itme with this index
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

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
document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.querySelector(".sign-in button");

  // Add the animation class on hover
  signInButton.classList.add("animate-hover");

  // Remove the animation class after button is clicked
  signInButton.addEventListener("click", function () {
    this.classList.remove("animate-hover");
  });
});


