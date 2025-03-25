import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import app from "@/api/firebase";
import { getAuth } from "firebase/auth"

const db = getFirestore(app,"database1")

function getUser(){
    return getAuth(app).currentUser
}

export async function addUser(inpEmail, inpData){
    await setDoc(doc(collection(db, "users"), `${inpEmail}`), inpData).then((r)=>{console.log(r)})
}

export async function getUserData(){
    const userData = await getDoc(doc(db, "users", `${getUser().email}`)) // Gets all data of the user within their document ie. json file
    console.log("retrieval from database: ", userData)
    return userData;
} 

export async function addToEvents(event){
    await updateDoc(doc(collection(db, "users"), `${getUser().email}`), {events: arrayUnion(event)})
}

export async function removeFromEvents(event){
    await updateDoc(doc(collection(db, "users"), `${getUser().email}`), {events: arrayRemove(event)})
}

export async function addToTasks(event){
    await updateDoc(doc(collection(db, "users"), `${getUser().email}`), {tasks: arrayUnion(event)})
}

export async function removeFromTasks(event){
    await updateDoc(doc(collection(db, "users"), `${getUser().email}`), {tasks: arrayRemove(event)})
}

export async function updateSetting(settingName, settingValue){
    let upd = {}
    upd[`settings.${settingName}`] = settingValue
    await updateDoc(doc(collection(db, "users"), `${getUser().email}`), upd)
}

