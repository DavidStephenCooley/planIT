import { getFirestore, setDoc, collection, getDoc, doc} from "firebase/firestore";
import app from "@/api/firebase";

const db = getFirestore(app,"database1")

export async function addUser(inpEmail, inpData){
    await setDoc(doc(collection(db, "users"), `${inpEmail}`), {data:inpData})
}

export async function getUserData(inpEmail){
    const q = await getDoc(doc(db, "users", `${inpEmail}`))
    console.log("retrieval from database: ", q)
} 