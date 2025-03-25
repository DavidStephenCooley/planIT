import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import app from "@/api/firebase";

const db = getFirestore(app,"database1")

export async function addUser(inpEmail, inpData){
    await setDoc(doc(collection(db, "users"), `${inpEmail}`), {data:inpData}).then((r)=>{console.log(r)})
}

export async function getUserData(inpEmail){
    const userData = await getDoc(doc(db, "users", `${inpEmail}`)) // Gets all data of the user within their document ie. json file
    console.log("retrieval from database: ", userData)
    return userData;
} 

export async function addToEvents(inpEmail, event){
    await updateDoc(doc(collection(db, "users"), `${inpEmail}`), {events: arrayUnion(event)})
}

export async function removeFromEvents(inpEmail, event){
    await updateDoc(doc(collection(db, "users"), `${inpEmail}`), {events: arrayRemove(event)})
}

export async function addToTasks(inpEmail, event){
    await updateDoc(doc(collection(db, "users"), `${inpEmail}`), {tasks: arrayUnion(event)})
}

export async function removeFromTasks(inpEmail, event){
    await updateDoc(doc(collection(db, "users"), `${inpEmail}`), {tasks: arrayRemove(event)})
}


