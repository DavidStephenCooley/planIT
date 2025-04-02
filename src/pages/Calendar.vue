<script setup>
import { ref, onMounted, watch, onBeforeUpdate } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import '@/assets/global.css'
import { updateSetting, getUserData, addToTasks, setAllSettings, updateTask } from "../components/databaseFunctions/userDataFunctions"
import app from '@/api/firebase';

const router = useRouter()

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthLabel = ref("MONTH");
const calendar = ref([]);

let repeatingCheck = false;
let foreverCheck = true;
let viewTaskOpen = false;
let newTaskOpen = false;
let settingsOpen = false;
let selectDate = 0;

let backgroundColour;
let calendarColour;
let chevronedColour;
let headerColour;
let selectedDayColour;
let textColour;
let todayColour;
let todayTextColour;
let otherMonthTextColour;

const dataLoaded = ref(false)
let tasks = []
let tasksDict = []
let selectedDay;
const currentDayTasks = ref([]);

function toStringfromDay(day){
  if(day != undefined){
    const month = (!day.isCurrentMonth)?((day.day > 15)? currentMonth.value-1 : currentMonth.value+1):(currentMonth.value)
    return currentYear.value + "-" + (month<10?"0":"")+(month+1) + "-" + (day.day<10?"0":"") + day.day
  }

}

function selectDay(day){
    selectedDay = day
    currentDayTasks.value = tasksDict[toStringfromDay(selectedDay)]
}

function getTasksForDate(day){
  let ind = toStringfromDay(day)
  console.log(ind)
  return tasksDict[ind]
}

async function refreshTaskPreviews() {
  dataLoaded.value=false;
  setTimeout(()=>{dataLoaded.value=true}, 1)
}


const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
               "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Update month label and calendar whenever month/year changes
watch([currentMonth, currentYear], () => {
  updateMonthLabel();
  updateCalendar();
  refreshTaskPreviews()
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

onMounted(()=>{
  console.log("mounted")
  updateMonthLabel();
  updateCalendar();
  loadData();
})

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
    cssVarUpdate.setProperty("--background-colour", backgroundColour)
    cssVarUpdate.setProperty("--calendar-colour", calendarColour)
    cssVarUpdate.setProperty("--chevroned-colour", chevronedColour)
    cssVarUpdate.setProperty("--header-colour", headerColour)
    cssVarUpdate.setProperty("--selected-day-colour", selectedDayColour)
    cssVarUpdate.setProperty("--text-colour", textColour)
    cssVarUpdate.setProperty("--today-colour", todayColour)
    cssVarUpdate.setProperty("--today-text-colour", todayTextColour)
    cssVarUpdate.setProperty("--other-month-text-colour", otherMonthTextColour)

  }

  async function loadData(){
    const cssVarUpdate = document.documentElement.style
    await getUserData()
    .then((data)=>{
      console.log(data)
      const sett = data.settings

      cssVarUpdate.setProperty("--background-colour", sett.backgroundColour)
      backgroundColour = sett.backgroundColour
      document.getElementById("cssVarBG").value = backgroundColour

      cssVarUpdate.setProperty("--calendar-colour", sett.calendarColour)
      calendarColour = sett.calendarColour
      document.getElementById("cssVarCalendar").value = calendarColour
      
      cssVarUpdate.setProperty("--other-month-text-colour", sett.otherMonthTextColour)
      otherMonthTextColour = sett.otherMonthTextColour
      document.getElementById("cssVarOtherMonthText").value = otherMonthTextColour

      cssVarUpdate.setProperty("--chevroned-colour", sett.chevronedColour)
      chevronedColour = sett.chevronedColour
      document.getElementById("cssVarChevroned").value = chevronedColour

      cssVarUpdate.setProperty("--header-colour", sett.headerColour)
      headerColour = sett.headerColour
      document.getElementById("cssVarHeader").value = headerColour

      cssVarUpdate.setProperty("--selected-day-colour", sett.selectedDayColour)
      selectedDayColour = sett.selectedDayColour
      document.getElementById("cssVarSelected").value = selectedDayColour

      cssVarUpdate.setProperty("--text-colour", sett.textColour)
      textColour = sett.textColour
      document.getElementById("cssVarText").value = textColour

      cssVarUpdate.setProperty("--today-colour", sett.todayColour)
      todayColour = sett.todayColour
      document.getElementById("cssVarToday").value = todayColour

      cssVarUpdate.setProperty("--today-text-colour", sett.todayTextColour)
      todayTextColour = sett.todayTextColour
      document.getElementById("cssVarTodayText").value = todayTextColour

      //TASKS
      tasks = data.tasks;
      let seen = []
      const taskDay = (d1, d2)=>{
        return new Date(d1.date).getTime() == new Date(d2).getTime()
      }
      for(const task of tasks){
        if(seen[task.date])continue;
        tasksDict[task.date] = tasks.filter((t)=>taskDay(t, task.date))
        seen[task.data] = true;
      }
      //console.log(tasksDict)
    })
    dataLoaded.value = true
  }

  function resetToDefaultColours() {
    const cssVarUpdate = document.documentElement.style

    cssVarUpdate.setProperty("--background-colour", "#181818")
    backgroundColour = "#181818"
    document.getElementById("cssVarBG").value = backgroundColour

    cssVarUpdate.setProperty("--calendar-colour", "#424242")
      calendarColour = "#424242"
      document.getElementById("cssVarCalendar").value = calendarColour
      
      cssVarUpdate.setProperty("--other-month-text-colour", "#888888")
      otherMonthTextColour = "#888888"
      document.getElementById("cssVarOtherMonthText").value = otherMonthTextColour
      
      cssVarUpdate.setProperty("--chevroned-colour", "#3a3a3a")
      chevronedColour = "#3a3a3a"
      document.getElementById("cssVarChevroned").value = chevronedColour

      cssVarUpdate.setProperty("--header-colour", "#343434")
      headerColour = "#343434"
      document.getElementById("cssVarHeader").value = headerColour

      cssVarUpdate.setProperty("--selected-day-colour", "#757575")
      selectedDayColour = "#757575"
      document.getElementById("cssVarSelected").value = selectedDayColour

      cssVarUpdate.setProperty("--text-colour", "#b1b1b1")
      textColour = "#b1b1b1"
      document.getElementById("cssVarText").value = textColour

      cssVarUpdate.setProperty("--today-colour", "#adadad")
      todayColour = "#adadad"
      document.getElementById("cssVarToday").value = todayColour

      cssVarUpdate.setProperty("--today-text-colour", "#0a0a0a")
      todayTextColour = "#0a0a0a"
      document.getElementById("cssVarTodayText").value = todayTextColour

      setAllSettings({backgroundColour: "#181818", calendarColour: "#424242", todayColour: "#adadad", selectedDayColour: "#757575", 
      chevronedColour: "#3a3a3a", headerColour: "#343434", textColour: "#b1b1b1", todayTextColour:"#0a0a0a", otherMonthTextColour:"#888888"})

    updateTheme();
  }

  function signOutUser(){
    const auth = getAuth()
    signOut(auth)
        .then(()=> {
            //console.log("wudup")
            router.push({path:"/"})
             //Sign out success, then route to back to login page? Or just update whether signed in or not
        }).catch((error)=>{
            console.error("Sign out error: ", error)
    })


  }

  function generateRandomID(){
    return Math.random().toString(32).substring(2)
  }

  function collectTaskData(){
    let taskData = {
      id: generateRandomID(),
      title: document.getElementById("title").value,
      date: document.getElementById("date").value,
      isRepeating: document.getElementById("isRepeating").value || null,
      repeatType: document.getElementById("repeatType").value,
      forever: document.getElementById("forever").value,
      until: document.getElementById("until").value,
      dateUntil: document.getElementById("dateUntil").value || null,
      taskColour: document.getElementById("taskColour").value,
      description: document.getElementById("taskDescription").value || null
    }

    const thing = document.getElementById("date").value
    //console.log("taks",tasksDict[date])
    if(tasksDict[thing] != undefined){
      tasksDict[thing].push(taskData)
    }else{
      tasksDict[thing] = [taskData]
    }
    refreshTaskPreviews()
    //console.log(taskData)
    return taskData;
  }

  function dateUpdate(number) {
    selectDate = number;
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

  function popoutViewTask(calendarClick) {
    if (calendarClick) {
      viewTaskOpen = true;
    } else {
      viewTaskOpen = !viewTaskOpen;
    }
    let button = document.getElementById("taskViewButton");
    let inputs = document.getElementById("taskViewHidden");
    if (viewTaskOpen) {
      if (settingsOpen) {
        popoutSettings();
      }
      button.style.height = "75vh";
      button.style.width = "18vw";
      button.style.justifyContent = "right";
      document.getElementById("viewTaskChevron").style.transform = "rotate(180deg)";
      inputs.style.left = "0vh"
    } else {
      button.style.height = "8vh";
      button.style.width = "3vw";
      button.style.justifyContent = "center";
      document.getElementById("viewTaskChevron").style.transform = "rotate(0deg)";
      inputs.style.left = "-100vh"
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

  function repeatingClick() {
    const text = document.getElementById("repeatingText")
    if(repeatingCheck == false) {
      text.style.opacity = "100%";
      text.style.pointerEvents = "all";
      text.style.userSelect = "all";
      repeatingCheck = true;
    }
    else {
      text.style.opacity = "60%";
      text.style.pointerEvents = "none";
      text.style.userSelect = "none";
      repeatingCheck = false;
    }
  }

  function foreverClick() {
    const forever = document.getElementById("forever");
    const until = document.getElementById("until");
    const untilText = document.getElementById("dateUntil");
    if(foreverCheck == true) {
      forever.checked = false
      until.checked = true
      foreverCheck = false;
      untilText.style.opacity = "100%"
    }
    else {
      forever.checked = true
      until.checked = false
      foreverCheck = true;
      untilText.style.opacity = "60%"
  }
  }

  function checkIfLessThanTwentyEightTasksAlreadyThere() {
    const elem = document.getElementById("date").value;
    console.log(elem);
    if (tasksDict[elem] == undefined || tasksDict[elem].length < 16) {
      addToTasks(collectTaskData())
    } else {
      alert("You already have 16 tasks on this day.");
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
              <td class="calanderDay" @click="popoutViewTask(true); addDate(day); selectDay(day)" v-on:dblclick="popoutNewTask(true)"
                v-for="(day, dayIndex) in week" 
                :key="dayIndex" 
                :class="{ 
                today: isToday(day.day) && day.isCurrentMonth,
                'other-month': !day.isCurrentMonth
                }"
                >
                {{ day.day }}
                <div class="taskPreviewContainer">

                  <div id="taskPreview" v-if="dataLoaded" v-for="(box,index) in getTasksForDate(day)" :key="dataLoaded" :style="{backgroundColor:box.taskColour}"> 
                    <div id="taskPreviewText" >
                    {{ (getTasksForDate(day).length < 5)?(box.title):("") }}
                    </div>
                  </div>

                </div>
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
    <label class="settingslabels" >Background:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarBG"
      v-model="backgroundColour"
      @input="updateTheme()"
      @change="updateSetting('backgroundColour', backgroundColour)"
    
    > <br>
    <label class="settingslabels" >Calendar:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarCalendar"
      v-model="calendarColour"
      @input="updateTheme()"
      @change="updateSetting('calendarColour', calendarColour)"
      
    > <br>
    <label class="settingslabels" >Today:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarToday"
      v-model="todayColour"
      @input="updateTheme()"
      @change="updateSetting('todayColour', todayColour)"
      
    > <br>
    <label class="settingslabels" >Chosen Day:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarSelected"
      v-model="selectedDayColour"
      @input="updateTheme()"
      @change="updateSetting('selectedDayColour', selectedDayColour)"
      
    > <br>
    <label class="settingslabels" >Tabs:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarChevroned"
      v-model="chevronedColour"
      @input="updateTheme()"
      @change="updateSetting('chevronedColour', chevronedColour)"
      > <br>
    <label class="settingslabels" >Header:</label>
    <input
      type="color"
      class="settingsColor"
      id="cssVarHeader"
      v-model="headerColour"
      @input="updateTheme()"
      @change="updateSetting('headerColour', headerColour)"
      
    > <br>
    <label class="settingslabels" >Text:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarText"
      v-model="textColour"
      @input="updateTheme()"
      @change="updateSetting('textColour', textColour)"
      
    > <br>
    <label class="settingslabels" >Today's Text:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarTodayText"
      v-model="todayTextColour"
      @input="updateTheme()"
      @change="updateSetting('todayTextColour', todayTextColour)"
      
    > <br>
    <label class="settingslabels" >Extra Days:</label>
    <input
      type="color" 
      class="settingsColor"
      id="cssVarOtherMonthText"
      v-model="otherMonthTextColour"
      @input="updateTheme()"
      @change="updateSetting('otherMonthTextColour', otherMonthTextColour)"
      
    > <br>
    <button @click="resetToDefaultColours()">Reset to Default</button>
    
    <button
      @click="signOutUser(router)">
      Sign Out
    </button>

    </div>

    <div id="profilePhoto" class="image">
      <img id="profilePhotoPhoto" src="../assets/profiletest.jpg">
    </div>


    <div id="taskViewButton" class="taskViewButton sidebutton">
      <span @click="popoutViewTask(false)" class="material-symbols-outlined" id="viewTaskChevron">arrow_forward_ios</span>
    </div>
    
    <!--  THIS WILL NEED TO BE A COMPONENT OR SOMETHING BECAUSE IT NEEDS TO BE REPEATED FOR EACH TASK ON A GIVEN DAY  -->
    <div id="taskViewHidden" class="hidden taskViewButton" >
      <div class="taskDetails" v-for="task in currentDayTasks">
        <span id="taskViewTitle">Today</span>
        <div id="taskViewTheThingThatRepeats">
          <input type="color" id="taskViewColor" v-model="task.taskColour" @input="updateTask(task)">
          <span id="taskViewName">{{task.title}}</span>
          <textarea type="text" id="taskViewDescription" v-model="task.description"></textarea>
        </div>
      </div>
    </div>


    <div id="newTaskButton" class="newTaskButton sidebutton">
      <span  @click="popoutNewTask(false)" class="material-symbols-outlined" id="add">add</span>
    </div>
    <div id="newTaskHidden" class="hidden newTaskButton">
      <input type="text" id="title" placeholder="Title" maxlength="15"><br>

      <input type="date" id="date" @click="dateUpdate(1)"><br>
      <input type="checkbox" id="isRepeating" 
      @click="repeatingClick()"><label>Repeating</label><br>
      <div id="repeatingText">

        <label>Every</label><input type="number" placeholder="Number of">
        <select id = "repeatType">
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select><br>

        <input type="checkbox" @click="foreverClick(1)"id="forever" checked="true"><label>Forever</label>
        <input type="checkbox" @click="foreverClick(2)"id="until"><label>Until</label><br>
        <input type="date" id="dateUntil" @click="dateUpdate(2)"><br>
      </div>
      <input type="text" id="taskDescription" placeholder="Add description...">
      <label>Colour</label><input type="color" id="taskColour"><br>
      <button @click="checkIfLessThanTwentyEightTasksAlreadyThere()">SAVE</button>

    </div>
  </main>
</template>

<style scoped>

html {
  font-size: 16px;
  overflow: hidden;
  margin: none;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
}

table {
  position: relative;
  table-layout: fixed;
  border-collapse: collapse;
}

.box {
  position: absolute;
}

.taskDetails{
  background-color: rgb(0, 0, 0);
}


#monthHeader {
  left: calc(50% - 30vw + 2vw); /*needs to be offset size of calander - a little*/
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

.taskPreviewContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap; /*starts new line once previous is full of tasks*/
  max-height: 9vh; /*each 2vw counts 1 task in row before wrap to new line*/
  gap: 0.8vh; /*margin*/
}

#taskPreview {
  height: 1.5vh;
  width: 1.5vh;
  border-radius: 1.5vh;
}
#taskPreviewText {
  height: 10vh;
  width: 6.5vw;
  position: relative;
  top: -1.1vh;
  left: 1vw; 
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
  position: fixed;
  left: calc(50% - 30vw);
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
  height: 12vh; /*set height so adding task divs doesent effect height*/
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

.settingslabels {
  margin: 2vh;
}

.settingsColor {
  width: 2vw;
  height: 2vw;
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  right: 8vw;
}

#profilePhoto {
  position: fixed;
  right: 1vw;
  top: 0vw;
  object-fit: cover;
  transform: scale(0.1);
  justify-content: right;
  width: 8vw;
  height: 5vh;
}

#profilePhotoPhoto {
  border-radius: 50%;
}

#profilePhotoPhoto:hover {
  box-shadow: 1vw 1vw 1vw 0.5vw black;
  cursor: pointer;
}

#newTaskHidden {
  position: fixed;
  height: 75vh;
  width: 34vh;
  right: -100vw;
  padding: 1vw;
  background: transparent;
}

#taskViewColor {
  width: 1.5vw;
  height: 1.5vw;
  background: none;

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

  outline: none;
}

.nohighlight {
  user-select: none;
}

/* Checkbox styling */
#newTaskHidden input[type="checkbox"] {
  margin-right: 0.5vw;
  margin-left: 0.5vw;
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
  opacity: 60%;
  pointer-events: none;
  user-select: none;
}

#dateUntil {
  opacity: 60%;
  pointer-events: none;
  user-select: none;
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

#taskViewHidden {
  position: fixed;
  height: 75vh;
  width: 34vh;
  right: -100vw;
  padding: 1vw;
  background: transparent;
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