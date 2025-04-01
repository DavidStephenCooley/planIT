import { getFirestore, setDoc, collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where} from "firebase/firestore";
import app from "@/api/firebase";
import { getAuth, signOut } from "firebase/auth"

const db = getFirestore(app,"database1")
const auth = getAuth()

export function getUser(){
    return getAuth(app).currentUser
}

export function getUserDoc(){
    return doc(collection(db, "users"), `${getUser().email}`)
}

export async function addUser(inpEmail, inpData){
    if((await getDoc(getUserDoc())).exists() != true){
        console.log("added user to database")
        await setDoc(doc(collection(db, "users"), `${inpEmail}`), inpData)
    }    
}

