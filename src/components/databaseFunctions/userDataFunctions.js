import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, deleteDoc} from "firebase/firestore";
import { getUserDoc, getUser } from "../loginAndRegFunctions/createUserFunctions"
import { updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import app from "@/api/firebase";

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
    console.log("hi")
    try{
        const data = await getUserData()
        let tasksList = data.tasks
        const corresponding = tasksList.find(t=>t.id == task.id)
        corresponding.taskColour = task.taskColour
        corresponding.description = task.description
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

const storage = getStorage(app)

export async function uploadProfilePic(element){
        // Creates a folder images (if it doesn't already exist)
    const storageRef = ref(storage, 'images/' + element.$refs.pfp.value);
        // Uploads to the the storage bucket
    const snap = await uploadBytes(storageRef, element.$refs.pfp.files[0])
    const url = await getDownloadURL(snap.ref)
    updateProfile(getUser(), {photoURL: url})
    return url
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

