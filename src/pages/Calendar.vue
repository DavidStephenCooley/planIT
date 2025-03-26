<script setup>
import { ref, onMounted, watch } from 'vue';
import '@/assets/global.css'
import { updateSetting, getUserData, addToTasks } from "../components/databaseFunctions/userDataFunctions"

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthLabel = ref("MONTH");
const calendar = ref([]);

let viewTaskOpen = false;
let newTaskOpen = false;
let settingsOpen = false;
let selectDate = 0;
let themeColor;


const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
               "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Update month label and calendar whenever month/year changes
watch([currentMonth, currentYear], () => {
  updateMonthLabel();
  updateCalendar();
});

function updateMonthLabel() {
  monthLabel.value = months[currentMonth.value];
}

function updateCalendar() {
  calendar.value = generateCalendar();
}

function prevMonth() {
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  if (currentMonth.value === 11) currentYear.value--;
}

function nextMonth() {
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  if (currentMonth.value === 0) currentYear.value++;
}

onMounted(() => {
  updateMonthLabel();
  updateCalendar();
  loadTheme();
});

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getNumWeeksInMonth() {
  const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value);
  const firstDay = getFirstDay(currentYear.value, currentMonth.value);
  
  // Calculate total cells needed (blank days at start + actual days)
  const totalCells = firstDay + daysInMonth;
  
  // Calculate how many rows (weeks) are needed (rounding up)
  return Math.ceil(totalCells / 7);
}


function generateCalendar() {
  const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value);
  const firstDay = getFirstDay(currentYear.value, currentMonth.value);
  let grid = [];
  
  // Calculate days from previous month to show
  const prevMonthDays = getDaysInMonth(
    currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
    currentMonth.value === 0 ? 11 : currentMonth.value - 1
  );
  
  let count = 1;
  const weeksNeeded = getNumWeeksInMonth();
  
  for (let row = 0; row < weeksNeeded; row++) {
    let week = [];
    for (let col = 0; col < 7; col++) {
      // Previous month days
      if (row === 0 && col < firstDay) {
        const day = prevMonthDays - firstDay + col + 1;
        week.push({ day, isCurrentMonth: false });
      } 
      // Next month days
      else if (count > daysInMonth) {
        const day = count - daysInMonth;
        week.push({ day, isCurrentMonth: false });
        count++;
      } 
      // Current month days
      else {
        week.push({ day: count, isCurrentMonth: true });
        count++;
      }
    }
    grid.push(week);
  }
  return grid;
}

function isToday(day) {
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
}

  function popoutNewTask(calendarClick) {
    if (calendarClick) {
      newTaskOpen = true;
    } else {
      newTaskOpen = !newTaskOpen;
    }
    let button = document.getElementById("newTaskButton");
    let inputs = document.getElementById("newTaskHidden");
    if (newTaskOpen) {
      button.style.height = "75vh";
      button.style.width = "18vw";
      button.style.justifyContent = "left";
      setTimeout(() => {
        inputs.style.right = "0vw";        
      }, 100);
    } else {
      button.style.height = "8vh";
      button.style.width = "3vw";
      button.style.justifyContent = "center";
      inputs.style.right = "-100vw";
    }
  }

  function addDate(dayObj) {
  let month = currentMonth.value;
  let year = currentYear.value;

  // If the day is from a different month (prev/next), adjust month and year
  if (!dayObj.isCurrentMonth) {
    if (dayObj.day > 20) { // Likely a day from the previous month
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
    } else { // Likely a day from the next month
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }

  // Format as YYYY-MM-DD (ISO format for `<input type="date">`)
  const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
  if (selectDate == 1) {
    document.getElementById("date").value = formattedDate;
    selectDate = 0;
  } else if (selectDate == 2) {
    document.getElementById("dateUntil").value = formattedDate;
    selectDate = 0;
  }
}

  function updateTheme(){
    const cssVarUpdate = document.documentElement.style
    cssVarUpdate.setProperty("--background-colour", themeColor)
  }

  async function loadTheme(){
    const cssVarUpdate = document.documentElement.style
    await getUserData()
    .then((data)=>{
      const sett = data.settings
      cssVarUpdate.setProperty("--background-colour", sett.backgroundColour)
    })
    
  }



  function dateUpdate(number) {
    selectDate = number;
  }

  function popoutViewTask(calendarClick) {
    if (calendarClick) {
      viewTaskOpen = true;
    } else {
      viewTaskOpen = !viewTaskOpen;

    }
    let button = document.getElementById("taskViewButton");
    if (viewTaskOpen) {
      if (settingsOpen) {
        popoutSettings();
      }
      button.style.height = "75vh";
      button.style.width = "18vw";
      button.style.justifyContent = "right";
      document.getElementById("viewTaskChevron").style.transform = "rotate(180deg)";
    } else {
      button.style.height = "8vh";
      button.style.width = "3vw";
      button.style.justifyContent = "center";
      document.getElementById("viewTaskChevron").style.transform = "rotate(0deg)";
    }
  }

    function popoutSettings() {
    settingsOpen = !settingsOpen;
    let button = document.getElementById("settings");
    let inputs = document.getElementById("settingsHidden");
    if (settingsOpen) {
      if (viewTaskOpen) {
        popoutViewTask();
      }
      
      button.style.height = "45vh";
      button.style.width = "18vw";
      button.style.alignItems = "end";
      button.style.paddingBottom = "1vh";
      inputs.style.top = "0vh";
    } else {
      button.style.height = "8vh";
      button.style.width = "3vw";
      button.style.alignItems = "center";
      inputs.style.top = "-100vh";
    }
  }
</script>

<template>
  <main>
    <div id="monthHeader" class="box">
      <span class="material-symbols-outlined chevron" @click="prevMonth">chevron_left</span>
      <span class="month-label">{{ monthLabel }} {{ currentYear }}</span>
      <span class="material-symbols-outlined chevron" @click="nextMonth">chevron_right</span>
    </div>
    <div id="surroundBox" class="box">
      <div id="headerBox" class="box">
        <table id="headerCalander" class="box">
          <thead>
            <tr>
              <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
            </tr>
          </thead>
        </table>
      </div>
      <div id="calenderBox" class="box">
        <table id="monthVue">
          <tbody>
            <tr v-for="(week, weekIndex) in calendar" :key="weekIndex">
              <td @click="popoutViewTask(true); addDate(day)" v-on:dblclick="popoutNewTask(true)"
                v-for="(day, dayIndex) in week" 
                :key="dayIndex" 
                :class="{ 
                today: isToday(day.day) && day.isCurrentMonth,
                'other-month': !day.isCurrentMonth
                }"
                >
                {{ day.day }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="settings" class="settingsClass sidebutton">
      <span @click="popoutSettings()" class="material-symbols-outlined" id="settingsIcon">settings</span>
    </div>

    <div id="settingsHidden" class="hidden settingsClass">
      <span>Colour:</span>
     <input
      type="color" 
      v-model="themeColor"
      @input="updateTheme()"
      @change="updateSetting('backgroundColour', themeColor)"
      style="
      width: 2vw;
      height: 4.5vh;
      border: none;
      background: none;
      cursor: pointer;
      "
    >
    </div>

    <div id="taskViewButton" class="sidebutton">
      <span @click="popoutViewTask(false)" class="material-symbols-outlined" id="viewTaskChevron">arrow_forward_ios</span>
    </div>
    <div id="newTaskButton" class="newTaskButton sidebutton">
      <span  @click="popoutNewTask(false)" class="material-symbols-outlined" id="add">add</span>
    </div>
    <div id="newTaskHidden" class="hidden newTaskButton">
      <input type="text" id="title" placeholder="Title"><br>
      <input type="date" id="date" @click="dateUpdate(1)"><br>
      <input type="checkbox" id="isRepeating"><label>Repeating</label><br>
      <span id="repeatingText">
        <label>Every</label><input type="number" placeholder="Number of">
        <select id = "repeatType">
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select><br>
        <input type="checkbox" id="forever"><label>Forever</label>
        <input type="checkbox" id="until"><label>Until</label><br>
        <input type="date" id="dateUntil" @click="dateUpdate(2)"><br>
        <label>Colour</label><input type="color" id="taskColour"><br>
        <button @click="addToTasks()">SAVE</button>
      </span>
    </div>
  </main>
</template>

<style scoped>

html {
  font-size: 16px;
  overflow: hidden;
}

.box {
  position: absolute;
}

#monthHeader {
  left: calc(50% - 30vw + 2vw);
  top: 8vh;
  background-color: var(--chevroned-colour);
  width: 15vw;
  height: 5vh;
  border-top-left-radius: 1vw; border-top-right-radius: 1vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1vw;
}

.month-label {
  flex-grow: 1;
  text-align: center;
}

.chevron {
  cursor: pointer;
  transition: color 0.2s;
}

.chevron:hover {
  color: #ccc;
}

#surroundBox {
  height:75vh;
  width: 60vw;
  background-color: var(--header-colour);
  border-radius: 1vw;
  margin: 0 auto;
}

#headerBox {
  height: 7vh;
  width: 60vw;
  background-color: var(--header-colour);
  border-top-left-radius: 1vw;
  border-top-right-radius: 1vw;
}

#calenderBox {
  height: calc(75vh - 6vh);
  width: 60vw;
  background-color: var(--calendar-colour);
  top: 10vh;
  border-bottom-right-radius: 1vw;
  border-bottom-left-radius: 1vw;
}

#headerCalander {
  width: 60vw;
  top: 1vh;
  table-layout: fixed;
  font-size: 1.5rem;
}

#monthVue {
  background-color: transparent;
  width: 60vw;
  height: calc(75vh - 6vh);
}

td {
  vertical-align: top;
  padding-left: 1vw;
  padding-top: 0.5vh;
  transition: all 0.1s ease-out;
  border-radius: 1vw;

}

td:hover {
  background-color: var(--selected-day-colour);
  cursor: pointer;
}

.today {
  background-color: var(--today-colour);
  color: var(--today-text-colour);
  border-radius: 0.75vw;
}

.settingsClass {
  background-color: var(--chevroned-colour);
  left: 1vw;
  top: 0;
  border-bottom-right-radius: 1vw; border-bottom-left-radius: 1vw;
}

.hidden {
  background-color: transparent;
  color: white;
}

#settingsHidden {
  position: fixed;
  height: 40vh;
  width: 18vw;
  top: -100vh;
  left: 1vw;
}

/* Main container styling */
#newTaskHidden {
  position: fixed;
  height: 75vh;
  width: 34vh;
  right: -100vw;
  padding: 1vw;
  background: transparent;
}

/* Input field styling */
#newTaskHidden input[type="text"],
#newTaskHidden input[type="date"],
#newTaskHidden input[type="number"],
#newTaskHidden select {
  width: 100%;
  padding: 0.69vw;
  margin: 0.5vw 0;
  border-radius: 0.5vw;
  font-size: 1rem;
}

#newTaskHidden input[type="text"]:focus,
#newTaskHidden input[type="date"]:focus,
#newTaskHidden input[type="number"]:focus,
#newTaskHidden select:focus {
  border-color: #4a90e2;
  outline: none;
}

/* Checkbox styling */
#newTaskHidden input[type="checkbox"] {
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  accent-color: #4a90e2;
}

/* Label styling */
#newTaskHidden label {
  font-size: 1rem;
  color: var(--text-colour);
  margin-right: 1rem;
  user-select: none;
}

/* Repeating options section */
#repeatingText {
  display: block;
  margin-top: 0.5vh;
}

/* Color input styling */
#newTaskHidden input[type="color"] {
  width: 2vw;
  height: 2vw;
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 0vw;
  vertical-align: middle;
}

/* Button styling */
#newTaskHidden button {
  width: 100%;
  padding: 1vw;
  margin-top: 1.75vh;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 0.5vw;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

#newTaskHidden button:hover {
  background-color: #3a7bc8;
}

/* Responsive adjustments */
@media (max-width: 400px) {
  #newTaskHidden {
    width: 90%;
    padding: 1vw;
  }
}

#taskViewButton {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-top-right-radius: 1vw;
  border-bottom-right-radius: 1vw;
}

.newTaskButton {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-top-left-radius: 1vw;
  border-bottom-left-radius: 1vw;
}

.sidebutton {
  height: 8vh;
  width: 3vw;
  background-color: var(--chevroned-colour);
  position: fixed; /* Changed from absolute to fixed */
  transition: all 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.sidebutton:hover {
  height: 9vh;
  width: 5vw;
}

#settings:hover {
  width: 3vw;
  height: 8vh;
}

#settingsIcon:hover {
  transform: scale(1.4);
}

.other-month {
  color: var(--other-month-text-colour);
  opacity: 0.6;
}

.other-month:hover {
  background-color: var(--selected-day-colour);
  cursor: pointer;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

#add {
  font-size: 2rem;
}

.material-symbols-outlined {
  color: var(--text-colour);
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>