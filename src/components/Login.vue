<script setup>
import { ref } from "vue";

// Form values
const username = ref("");
const password = ref("");
const error = ref(false);

// Validation function
const validateForm = (event) => {
  error.value = !username.value.trim() || !password.value.trim();
  if (error.value) event.preventDefault(); // Prevent form submission
};
</script>

<template>
  <div id="authBox">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <h2>Login</h2>

    <form @submit="validateForm">
      <input type="text" class="input-field" v-model="username" placeholder="Username">
      <input type="password" class="input-field" v-model="password" placeholder="Password">
      <button type="submit" class="auth-button">Login</button>
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

