import { db } from "./firebase";
import {doc, getDoc} from "firebase/firestore"

export default async function getPreferences(userId) {
    try {
        const docRef = doc(db, "users", userId) //Reference user doc
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log("Preferences:", docSnap.data())
            return docSnap.data(); //Return stored data
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No preferences found!");
            return null;
          }
    }
    catch(error) {
        console.error("Error retrieving preferences:", error)
    }
}
