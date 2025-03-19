<script setup>
import { toDisplayString } from 'vue';

import { ref, computed } from 'vue';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const getCalendar = (year, month) => {
  let firstDay = new Date(year, month, 1).getDay(); // Get first day (0=Sunday)
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust to start week on Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let weeks = [];
  let week = new Array(7).fill(null); // Empty week

  let dayCounter = 1;
  for (let i = 0; i < 6; i++) { // Max 6 rows
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) continue; // Skip empty days before first date
      if (dayCounter > daysInMonth) break; // Stop if month is filled
      week[j] = dayCounter;
      dayCounter++;
    }
    weeks.push([...week]); // Push a copy of the week
    week.fill(null); // Reset week
    if (dayCounter > daysInMonth) break;
  }

  return weeks;
};

const calendar = computed(() => getCalendar(currentYear.value, currentMonth.value));
</script>

<template>
<main>
  <div id="surroundBox" class="box">
    <div id="headerBox" class="box">
      <table id="headerCalander" class="box">
        <thead>
          <tr id="days">
            <th v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day"> {{ day }}</th>
          </tr>
        </thead>
      </table>
    </div>
    <div id="calenderBox" class="box">
      <table id="monthVue">
        <tbody>
          <tr v-for="(week, rowIndex) in calendar" :key="rowIndex">
            <td v-for="(day, colIndex) in week" :key="colIndex"
            :class="[
              day === today.getDate() ? 'curr' : '',
              colIndex >= 5 ? 'weekend' : 'weekday'
            ]">
            {{ day || '' }}</td>
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