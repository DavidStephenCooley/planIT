<script setup>
import { ref } from "vue";
import app from "../api/firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Form values
const username = ref("");
const password = ref("");
const error = ref(false);

// Validation function
const validateForm = (event) => {
  error.value = !username.value.trim() || !password.value.trim();
  if (error.value) event.preventDefault();
  else{
    login()
  }
};

function login(){
const auth = getAuth(app);
createUserWithEmailAndPassword(auth, username.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    //console.log(errorCode, errorMessage)
    switch(errorCode){
      case "auth/invalid-email":
        console.log("please enter a valid email address")
        break;
      case "auth/weak-password":
        console.log("please enter a stronger password")
        break;
      case "auth/email-already-in-use":
        console.log("user already exists")
        break;
    }
  });
}
</script>

<template>
  <div id="authBox">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <h2>Register</h2>

    <form @submit="validateForm">
      <input type="text" class="input-field" v-model="username" placeholder="Username">
      <input type="password" class="input-field" v-model="password" placeholder="Password">
      <button type="button" class="auth-button" @click="validateForm">Register</button>
    </form>

    <p v-if="error" class="error-message">Both fields are required.</p>

    <div class="separator-container">
      <div class="separator-line"></div>
      <span class="or-text">OR</span>
      <div class="separator-line"></div>
    </div>

    <a href="google-login.html" class="auth-link google-login">Sign Up with Google</a>
    <a href="signup.html" class="auth-link">Sign Up with Email</a>
  </div>
</template>

<style>
@import "@/assets/loginStyle.css";
</style>

