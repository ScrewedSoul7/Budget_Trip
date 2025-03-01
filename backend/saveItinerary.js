import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveItinerary = async (userId, itinerary) => {
  try {
    await setDoc(doc(db, "users", userId), {itinerary}, {merge: true })
    console.log("User itinerary saved successfully!", itinerary);
  } catch (error) {
    console.error("Error saving itinerary:", error);
  }
}