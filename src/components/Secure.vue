<script setup>
import app from '../api/firebase';
import { getFunctions, httpsCallable} from "firebase/functions";

function created(){
// Call secure function and load some data
const functions = getFunctions(app);
const secureFunction = httpsCallable(functions, 'securefunction');
secureFunction()
.then((result) => {
// Read result of the Cloud Function.
/** @type {any} */
console.log(result);
});
}

</script>

<template>

    <p>secure page</p>

</template>

<style>




</style>