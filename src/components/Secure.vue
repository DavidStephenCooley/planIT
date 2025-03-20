<script setup>
import app from '../api/firebase';
import { onMounted, ref } from "vue"
import { getFunctions, httpsCallable} from "firebase/functions";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

let username = ref("")
let profilePic = ref("")
let loggedIn = false

const auth = getAuth(app)
signInWithEmailAndPassword(auth, "hi@gmail.com", "123456")

async function load(){
    const functions = getFunctions(app);
    const secureFunction = httpsCallable(functions, 'secureFunction');

    await secureFunction().then((result) => {
        console.log(result); 
        let user = getAuth(app).currentUser
        console.log(user)
        username.value = user.displayName
        profilePic.value = user.photoURL
    });
}

onMounted(()=>{
    load()
})

</script>

<template>

    <p>secure page</p>
    <p>Logged in as {{ username }}</p>
    <img v-bind:src="profilePic">

</template>

<style>




</style>