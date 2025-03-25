import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../api/firebase";
function isAuth(to, from, next){
    console.log("Checking auth");
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);
            // User is signed in so continue to desired page
            return next();
            // ...
        } else {
            // User is signed out
            // Send them back to the home page or maybe the login page
            return next({path : '/Login'});
        }
    });
}


function loadPage (component) {
    return () => import(`@/pages/${component}.vue`)}

export default [{ path: '/', component: loadPage('Login'), meta: { title: 'Login - PlanIT' } },
                { path: '/Secure', component: loadPage('Secure'), beforeEnter: isAuth },
                { path: '/Login', component: loadPage('Login'), meta: { title: 'Login - PlanIT' } },
                { path: '/Register', component: loadPage('Register'), meta: { title: 'Register - PlanIT' } }]