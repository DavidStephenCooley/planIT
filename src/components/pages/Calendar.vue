<script setup>
import { ref, onMounted, watch } from 'vue';
import '@/assets/global.css'

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthLabel = ref("MONTH");
const calendar = ref([]);

let viewTaskOpen = false;
let newTaskOpen = false;
let settingsOpen = false;


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
  let days = getDaysInMonth(currentYear.value, currentMonth.value);
  let firstDay = getFirstDay(currentYear.value, currentMonth.value);
  let grid = [];
  
  let count = 1;
  const weeksNeeded = getNumWeeksInMonth();
  
  for (let row = 0; row < weeksNeeded; row++) {
    let week = [];
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        week.push("");
      } else if (count > days) {
        week.push("");
      } else {
        week.push(count);
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

  function popoutNewTask() {
    newTaskOpen = !newTaskOpen;
    let button = document.getElementById("newTaskButton");
    if (newTaskOpen) {
      button.style.height = "75vh";
      button.style.width = "18vw";
      button.style.justifyContent = "left";
    } else {
      button.style.height = "8vh";
      button.style.width = "3vw";
      button.style.justifyContent = "center";
    }
  }

  function popoutViewTask() {
    viewTaskOpen = !viewTaskOpen;
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
              <td v-for="(day, dayIndex) in week" :key="dayIndex" :class="{ today: isToday(day) }">
                {{ day }}
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
      @change="updateTheme"
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
      <span @click="popoutViewTask()" class="material-symbols-outlined" id="viewTaskChevron">arrow_forward_ios</span>
    </div>
    <div id="newTaskButton" class="sidebutton">
      <span  @click="popoutNewTask()" class="material-symbols-outlined" id="add">add</span>
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

#taskViewButton {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-top-right-radius: 1vw;
  border-bottom-right-radius: 1vw;
}

#newTaskButton {
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