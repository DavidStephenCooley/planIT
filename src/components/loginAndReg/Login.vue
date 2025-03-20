<script setup>
import { ref } from "vue";
import app from "../../api/firebase"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import handleError from "./errorHandling";

// Form values
const username = ref("");
const password = ref("");
const error = ref("");

// Validation function
const validateForm = (event) => {
  if (!username.value.length || !password.value.length){
    event.preventDefault();
  }
  login()
};

function login(){
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      //this.$router.push({path:"/Secure"})
      // ...
    })
    .catch((e) => {
      console.log(e)
      error.value = handleError(e)
      if (!username.value.length || !password.value.length){
        error.value = "please enter both fields"
      }
    });
}
</script>

<template>

  <div id="authBox">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <h2>Login</h2>

    <form @submit="validateForm">
      <input type="text" class="input-field" v-model="username" placeholder="Username">
      <input type="password" class="input-field" v-model="password" placeholder="Password">
      <p v-if="error!=null" class="error-message" :key="error">{{ error }}</p>
      <button type="button" class="auth-button" @click="validateForm">Login</button>
    </form>

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

