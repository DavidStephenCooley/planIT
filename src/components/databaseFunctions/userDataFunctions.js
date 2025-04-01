import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where} from "firebase/firestore";
import { getUserDoc } from "../loginAndRegFunctions/createUserFunctions"

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

export async function setAllSettings(sett){
    await updateDoc(getUserDoc(), {settings: sett})
}
