<script setup>
import { ref, onMounted } from "vue";
import app from "../api/firebase"
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import handleError from "../components/loginAndRegFunctions/errorHandler";


// Form values
const username = ref("");
const email = ref("")
const password = ref("");
const error = ref("");
const router = useRouter() // gets the router

onMounted(() => { // Allows user to press enter instead of needing to press the login button
  const loginButton =  document.querySelectorAll('.input-field').forEach((inp)=>{
    inp.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        validateForm(event);
      }
    });
  })
});

// Validation function
const validateForm = (event) => {
  if (!username.value.length || !password.value.length || !email.value.length){ // No submit unless all 3 are entered
    event.preventDefault();
  }
  register()
};

function register(){
  const auth = getAuth(app);
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      updateProfile(user, {displayName: username.value, photoURL: "https://cdn.usdairy.com/optimize/getmedia/b5108b6f-59c3-4cc4-b1d5-4b9b0d1e0c54/swiss.jpg.jpg.aspx?format=webp"})
      router.push({path:"/secure"}) 
      //                                                            Profile picture for now ^
      
    })
    .catch((e) => {
      error.value = handleError(e) // If something goes wrong go to error handler
      if (!username.value.length || !password.value.length || !email.value.length){
        error.value = "Please enter all fields"
      }
    });
}
</script>

<template>
  <div id="authBox">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <h2>Registration</h2>

    <form @submit="validateForm">
      <input type="text" class="input-field" v-model="username" placeholder="Username">
      <input type="text" class="input-field" v-model="email" placeholder="Email">
      <input type="password" class="input-field" v-model="password" placeholder="Password">
      <p v-if="error!=''" class="error-message" :key="error">{{ error }}</p>
      <button type="button" class="auth-button" @click="validateForm">Register</button>
    </form>

    <div class="separator-container">
      <div class="separator-line"></div>
      <span class="or-text">OR</span>
      <div class="separator-line"></div>
    </div>

  
    <button class="auth-link" @click="router.push('/login')">Sign In with Email</button>
  </div>
</template>

<style>
@import "@/assets/loginStyle.css";
</style>

