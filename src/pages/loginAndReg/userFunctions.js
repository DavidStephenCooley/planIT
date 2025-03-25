import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where} from "firebase/firestore";
import app from "@/api/firebase";
import { getAuth } from "firebase/auth"

const db = getFirestore(app,"database1")

function getUser(){
    return getAuth(app).currentUser
}

function getUserDoc(){
    return doc(collection(db, "users"), `${getUser().email}`)
}

export async function addUser(inpEmail, inpData){
    if((await getDoc(getUserDoc())).exists() != true){
        console.log("added user to database")
        await setDoc(doc(collection(db, "users"), `${inpEmail}`), inpData)
    }    
}

export async function getUserData(){
    const userData = await getDoc(getUserDoc()) // Gets all data of the user within their document ie. json file
    //console.log("retrieval from database: ", userData.data())
    return userData.data();
} 

export async function addToEvents(event){
    await updateDoc(getUserDoc(), {events: arrayUnion(event)})
}

export async function removeFromEvents(event){
    await updateDoc(getUserDoc(), {events: arrayRemove(event)})
}

export async function addToTasks(event){
    await updateDoc(getUserDoc(), {tasks: arrayUnion(event)})
}

export async function removeFromTasks(event){
    await updateDoc(getUserDoc(), {tasks: arrayRemove(event)})
}

export async function updateSetting(settingName, settingValue){
    let upd = {}
    upd[`settings.${settingName}`] = settingValue
    await updateDoc(getUserDoc(), upd).then(console.log("saved setting:" + settingName))
}

export async function getSetting(settingName) {
    const d = await getUserData()
    console.log(d)
    return d.settings[settingName]
}
