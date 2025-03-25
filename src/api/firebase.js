// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgqLaTTthlsVHfyLXzCXbLFctH7eAlVuo",
  authDomain: "planit-1409a.firebaseapp.com",
  projectId: "planit-1409a",
  storageBucket: "planit-1409a.firebasestorage.app",
  messagingSenderId: "129895290946",
  appId: "1:129895290946:web:8fa9040c056f69923935db",
  measurementId: "G-XGS5R4L9NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app