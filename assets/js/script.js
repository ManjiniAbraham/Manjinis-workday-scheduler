// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {

  // Update the current time and date every second
  setInterval(updateDateTime, 1000);

  // create the days schedule
  createDaySchedule();

  // setup the hour blocks
  setupDaySchedule();

  // fill with tasks that are stored
  fillDaySchedule();

  // adding click even for all save buttons
  $("button[class*='saveBtn']").on("click", saveSchedule)

});

// setup the main variables
let todaysDate = dayjs().format('YYYY-MM-DD');
let daySchedule = localStorage.daySchedule ? JSON.parse(localStorage.daySchedule) : [];

let startTime = 0; // 9am 
let endTime = 23; // 5pm

function createDaySchedule(){

  // create all the div elements for the hours schedule block based on startTime and endTime. Use day.js function to format the actual hour for the current date. 
  for (startTime; startTime <= endTime; startTime++) {

    $("#dayEvents").append('<div id="hour-" class="row time-block"> <div class="col-2 col-md-1 hour text-center py-3">' + dayjs(todaysDate + " " + startTime + ":00:00").format('hA') + '</div> <textarea class="col-8 col-md-10 description" rows="3"> </textarea> <button class="btn saveBtn col-2 col-md-1" aria-label="save"> <i class="fas fa-save" aria-hidden="true"></i> </button></div>');

    $("#hour-").attr("id", "hour-" + startTime);
  }
}

function setupDaySchedule(){

  $("div[id^='hour-']").each(function () {
    $(this).children('textarea').val("");
    let timeSlot = $(this).attr("id").replace("hour-", "");
    if (dayjs(todaysDate).isBefore(dayjs(), 'day') ||
       (dayjs(todaysDate).isSame(dayjs(), 'day') && timeSlot < parseInt(dayjs().format("H")))) {
      // if the current time div is less than the current hour of the day, then use past "grey" class
      $(this).addClass('past').removeClass('present future');
    } else if (dayjs(todaysDate).isAfter(dayjs(), 'day') ||
      (dayjs(todaysDate).isSame(dayjs(), 'day') && timeSlot > parseInt(dayjs().format("H")))) {
      // if current time div is greater than the current hour, then use future "green" class
      $(this).addClass('future').removeClass('present past');
    } else {
      // if at the current time div is within the current hour, then use the present "red" class
      $(this).addClass('present').removeClass('future past');
    }
  });
}

// fill the hours with tasks if available
function fillDaySchedule() {
  daySchedule.forEach(schedule => {
    $("#" + schedule.hour).children('textarea').val(schedule.task);
  });
}

// save the schedule for the tasks that were entered in the respective time blocks
function saveSchedule(e){
  e.preventDefault();

  let taskDesc = $(this).parent().children('textarea').val().trim();

  
  // find the right time block from the daySchedule
  let scheduleIndex = daySchedule.findIndex(schedule => schedule.hour === $(this).parent().attr("id"));

  // if there's no time block present, add with the entries from the list, else update with what's been entered from the list.
  if (scheduleIndex == -1) {
    daySchedule.push({
      hour: $(this).parent().attr("id"),
      task: taskDesc
    });
  } else {
    daySchedule[scheduleIndex] = {
      hour: $(this).parent().attr("id"),
      task: taskDesc
    }
  }

  localStorage.daySchedule = JSON.stringify(daySchedule);
  console.log(JSON.stringify(daySchedule));

  
}

// update the page with the current date.
function updateDateTime() {

  // Get the current time and format it using Day.js
  var currentTime = dayjs().format('dddd MMMM D YYYY');

  // Update the current time and date in the HTML
  $('#currentDay').text(currentTime);

}