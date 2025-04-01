import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where} from "firebase/firestore";
import { getUserDoc } from "../loginAndRegFunctions/createUserFunctions"

export async function getUserData(){
    try {
        const userData = await getDoc(getUserDoc()) // Gets all data of the user within their document ie. json file
    //console.log("retrieval from database: ", userData.data())
    return userData.data();
    } catch (error) {
        console.error("Something went wrong:", error)
    }
    
} 

export async function addToEvents(event){
    try {
        await updateDoc(getUserDoc(), {events: arrayUnion(event)})
    } catch (error) {
        console.error("Something went wrong:", error)
    }
}

export async function removeFromEvents(event){
    try {
        await updateDoc(getUserDoc(), {events: arrayRemove(event)})
    } catch (error) {
        console.error("Something went wrong:", error)
    }
}

export async function addToTasks(event){
    try {
        await updateDoc(getUserDoc(), {events: arrayRemove(event)})
    } catch (error) {
        console.error("Something went wrong:", error)
    }
}

export async function removeFromTasks(event){
    try {
        await updateDoc(getUserDoc(), {tasks: arrayRemove(event)}) 
    } catch (error) {
        console.error("Something went wrong:", error)
    }
}

export async function updateSetting(settingName, settingValue){
    try {
        let upd = {}
        upd[`settings.${settingName}`] = settingValue
        await updateDoc(getUserDoc(), upd).then(console.log("saved setting:" + settingName))
    } catch (error) {
        console.error("Something went wrong:", error)
    }
    
}

export async function setAllSettings(sett){
    try {
        await updateDoc(getUserDoc(), {settings: sett})
    } catch (error) {
        console.error("Something went wrong:", error)
    }
}
