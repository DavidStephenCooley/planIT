import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, deleteDoc} from "firebase/firestore";
import { getUserDoc } from "../loginAndRegFunctions/createUserFunctions"

export async function getUserData(){
    try {
        const u = getUserDoc()
        console.log(u)
        const userData = await getDoc(u) // Gets all data of the user within their document ie. json file
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
    //console.log(event)
    try {
        await updateDoc(getUserDoc(), {tasks: arrayUnion(event)})
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

export async function updateTaskColour(task){
    try{
        const data = await getUserData()
        let tasksList = data.tasks
        tasksList.find(t=>t.id == task.id).taskColour = task.taskColour
        await updateDoc(getUserDoc(), {tasks: tasksList})
    }catch(e){
        console.error(e)
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



/*   if(comfirm("Are you sure?")){
        txt = "Deleteing"
    
        try {
            const userRef = collection(db,"users");
            const query = query(userRef, where("email", "==", email));
            const querySnapShot = await getDocs(query); 

            if(querySnapShot.empty){
                console.log("User doesn't exsist");
                return;
            }

            querySnapShot.forEach(async (docsnap)=>{
                await deleteDoc(doc(db, "users", docsnap.id));
                console.log("user deleted")
            })
            
        } catch (error) {
            console.error("Error when deleting:", error)
        }
    }
    else{
        txt = "Cancelling"
        return null;
    } */

