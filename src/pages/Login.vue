<script setup>
import { ref, onMounted, useTemplateRef } from "vue";
import app from "../api/firebase";
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import handleError from "../components/loginAndRegFunctions/errorHandler";
import e from "cors";

// Form values
const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter()



// Validation function
const validateForm = (event) => {
  if (!username.value.length || !password.value.length){
    event.preventDefault();
  }
  login()
};

function login(){
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, username.value, password.value) // Checks if user(auth) exists with 'username', then checks if 'password' is correct
    .then((userCredential) => { 
      // Signed in 
      const user = userCredential.user;
      
      router.push({path:"/Secure"})
      // ...
    })
    .catch((e) => {
      console.log(e)
      error.value = handleError(e)
      if (!username.value.length || !password.value.length){
        error.value = "Please enter both fields!"
      }
    });
}

onMounted(() => { // Allows user to press enter instead of needing to press the login button
  const loginButton =  document.querySelectorAll('.input-field').forEach((inp)=>{
    inp.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        validateForm(event);
      }
    });
  })
});

</script>

<template>

  <div id="authBox">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <h2>Login</h2>

    <form @submit="validateForm">
      <input type="text" ref="loginButton" class="input-field" v-model="username" placeholder="E-mail">
      <input type="password" ref="loginButton" class="input-field" v-model="password" placeholder="Password">
      <p v-if="error!=null" class="error-message" :key="error">{{ error }}</p>
      <button type="button"  class="auth-button" @click="validateForm">Login</button>
    </form>

    <div class="separator-container">
      <div class="separator-line"></div>
      <span class="or-text">OR</span>
      <div class="separator-line"></div>
    </div>

    <!--<button class="auth-link google-login">Sign Up with Google</button>-->
    <button class="auth-link" @click="router.push({path: '/register'})">Sign Up with Email</button>
  </div>
</template>

<style>
@import "@/assets/loginStyle.css";
</style>



