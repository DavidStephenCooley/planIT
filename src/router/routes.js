import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable} from "firebase/functions"
import app from "../api/firebase";

async function isAuth(to, from, next) {
    console.log("Checking auth");
    const auth = getAuth(app);
    const func = getFunctions(app)
    const secureFunc = httpsCallable(func, "secureFunction")
    const res = await (await secureFunc()).data

    onAuthStateChanged(auth, ()=>{
        if (res) {
            console.log("User is authenticated:");
            next(); 
            return
        } else {
            console.log("User is not authenticated, redirecting to login.");
            next({ path: "/Login" });
            return
        }
    })    
}

function loadPage(component) {
    return () => import(`@/pages/${component}.vue`);
}

export default [
    { path: "/", component: loadPage("Login"), meta: { title: "Login - PlanIT" } },
    { path: "/Secure", component: loadPage("Secure"), beforeEnter: isAuth },
    { path: "/Login", component: loadPage("Login"), meta: { title: "Login - PlanIT" } },
    { path: "/Register", component: loadPage("Register"), meta: { title: "Register - PlanIT" } }
];