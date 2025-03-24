<script setup>
import { ref, onMounted, watch } from 'vue';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthLabel = ref("MONTH");
const calendar = ref([]);

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

function generateCalendar() {
  let days = getDaysInMonth(currentYear.value, currentMonth.value);
  let firstDay = getFirstDay(currentYear.value, currentMonth.value);
  let grid = [];

  let count = 1;
  for (let row = 0; row < 6; row++) {
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

.box {
  position: absolute;
}

#monthHeader {
  left: calc(50% - 30vw + 2vw);
  top: 8vh;
  background-color: rgb(66,66,66);
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
  background-color: rgb(66, 66, 66);
  border-radius: 1vw;
  margin: 0 auto;
}

#headerBox {
  height: 7vh;
  width: 60vw;
  background-color: rgb(50, 50, 50);
  border-top-left-radius: 1vw;
  border-top-right-radius: 1vw;
}

#calenderBox {
  height: calc(75vh - 6vh);
  width: 60vw;
  background-color: rgb(66, 66, 66);
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
  background-color: rgb(50, 50, 50);
  cursor: pointer;
}

.today {
  background-color: rgb(50, 50, 50);
  color: white;
}

/* Fixed sidebutton positioning */
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
  background-color: rgb(50, 50, 50);
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
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>