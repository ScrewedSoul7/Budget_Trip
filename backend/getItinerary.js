import { db } from "./firebase";
import {doc, getDoc} from "firebase/firestore"

export default async function getItinerary(userId) {
    try {
        const docRef = doc(db, "users", userId) //Reference user doc
        const docSnap = await getDoc(docRef)

        if (docSnap.exists() && docSnap.data().itinerary) {
            return docSnap.data().itinerary; //Return stored data
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No itinerary found!");
            return null;
          }
    }
    catch(error) {
        console.error("Error retrieving Itinerary:", error)
    }
}