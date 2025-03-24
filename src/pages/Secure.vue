<script setup>
import app from '../api/firebase';
import { onMounted, ref } from "vue"
import { getFunctions, httpsCallable} from "firebase/functions";
import { getAuth } from "firebase/auth";

let username = ref("")
let profilePic = ref("")

/*
const auth = getAuth(app)
signInWithEmailAndPassword(auth, "hi@gmail.com", "123456")
*/

onMounted(()=>{ // On mounted - whenever a vue page is loaded
    load() // When loaded runs load
})

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

    <p>secure page</p>
    <p>Logged in as {{ username }}</p>
    <img v-bind:src="profilePic">
    <router-link to="/Login">Login</router-link>
    <router-link to="/Register">Register</router-link>

</template>

<style>

</style>