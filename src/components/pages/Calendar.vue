<script setup>
import { ref } from 'vue';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

// Get number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Get the first weekday (0=Monday, 6=Sunday)
function getFirstDay(year, month) {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Adjust to start on Monday
}

// Build calendar grid manually
function generateCalendar() {
  let days = getDaysInMonth(currentYear.value, currentMonth.value);
  let firstDay = getFirstDay(currentYear.value, currentMonth.value);
  let grid = [];

  let count = 1;
  for (let row = 0; row < 6; row++) {
    let week = [];
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        week.push(""); // Empty space before month starts
      } else if (count > days) {
        week.push(""); // Empty space after month ends
      } else {
        week.push(count); // Add actual day
        count++;
      }
    }
    grid.push(week);
  }
  return grid;
}

const calendar = ref(generateCalendar());

function isToday(day) {
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
}
</script>

<template>
<main>
  <div id="surroundBox" class="box">
    <div id="headerBox" class="box">
      <table id="headerCalander" class="box">
        <thead>
          <tr>
            <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thu</th> <th>Fri</th> <th>Sat</th> <th>Sun</th>
          </tr>
        </thead>
      </table>
    </div>
    <div id="calenderBox" class="box">
      <table id="monthVue">
        <tbody>
          <tr v-for="week in calendar">
            <td v-for="day in week" :class="{ today: isToday(day) }">{{ day }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  <div id="taskViewButton" class="sidebutton">
    <span class="material-symbols-outlined">arrow_forward_ios</span>
  </div>
  <div id="newTaskButton" class="sidebutton">
    <span class="material-symbols-outlined" id="add">add</span>
  </div>
</main>
</template>

<style scoped>
html {
  font-size: 16px;
  overflow: hidden;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {

.box {
  position: absolute;
}

#surroundBox {
  height: 45rem;
  width: 60rem;
  background-color: rgb(66, 66, 66);
  border-radius: 1rem;
}

#headerBox {
  height: 6rem;
  width: 60rem;
  background-color: rgb(50, 50, 50);
  border-top-left-radius: 1rem; border-top-right-radius: 1rem;
}

#calenderBox {
  height: calc(45rem - 6rem);
  width: 60rem;
  background-color: rgb(66, 66, 66);
  top: 6rem;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

#headerCalander {
  width: 60rem;
  top: 2rem;
  table-layout: fixed;
  font-size: 1.5rem;
}
#days {
  background-color: rgb(50, 50, 50);
}

#monthVue {
  background-color: transparent;
  width: 60rem;
  
  height: 39rem;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

td {
  vertical-align: top;
  padding-left: 1rem;
  padding-top: 0.5rem;
  transition: all 0.1s ease-out;
  border-radius: 1rem;
}

td:hover {
  background-color: rgb(50, 50, 50);
  cursor: pointer;
}

td:active {
  background-color: black;
}

#taskViewButton {
  left: 0;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

#newTaskButton {
  left: calc(100% - 3rem);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

#newTaskButton:hover {
  left: calc(100% - 5rem)
  
}

.sidebutton {
  height: 8rem;
  width: 3rem;
  background-color: rgb(50, 50, 50);
  position: absolute;
  transition: all 0.1s ease-in-out; /* Smooth transition */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.sidebutton:hover {
  height: 9rem;
  width: 5rem;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures it takes full screen height */
  width: 100%; /* Makes sure it's full width */
}

.today {
  background-color: rgb(50, 50, 50);
  color: white;
}



#add {
  font-size: 2rem;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
}
</style>