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
    console.log(event)
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

export async function deleteUser(){
    if(comfirm("Are you sure?")){
        txt = "Deleteing"
    
    const auth = getAuth();
    const user = auth.currentUser 
        
    if(user){
        txt = "Deleteing"
        deleteUser(user)
        .then(() => {
            console.log("User account deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      } else {
        txt = "Cancelling"
        console.log("No user is currently signed in.");
    }
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

