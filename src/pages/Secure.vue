<script setup>
import app from '../api/firebase';
import Calendar from "./Calendar.vue";
import { onMounted, ref } from "vue"
import { getFunctions, httpsCallable} from "firebase/functions";
import { getAuth } from "firebase/auth";
import { addUser } from "./loginAndReg/userFunctions"

let username = ref("")
let profilePic = ref("")

onMounted(()=>{ // On mounted - whenever a vue page is loaded
    load() // When loaded runs load
    checkData()
})

async function checkData() {
    const auth = getAuth(app).currentUser
    addUser(auth.email,{events: [], // Data to be sent to database, TO DO: date/time of stuff sent in
                        tasks: [],
                        settings: {backgroundColour: "#181818", calendarColour: "#424242", todayColour: "#adadad", selectedDayColour: "#757575", 
                                    chevronedColour: "#3a3a3a", headerColour: "#343434", textColour: "#b1b1b1", todayTextColour:"#0a0a0a"}
                    })

}

async function load(){
    const functions = getFunctions(app); // Gets functions from firebase 
    const secureFunction = httpsCallable(functions, 'secureFunction'); // Gets secure functions from firebase

    await secureFunction().then((result) => {
        if(result.data){ // If logged in
        let user = getAuth(app).currentUser // Get logged in user
        
        username.value = user.displayName // Display name from firebase auth
        profilePic.value = user.photoURL // Photo from firebase auth
        }
    });
}

</script>

<template>

    <Calendar></Calendar>

</template>

<style>
</style>