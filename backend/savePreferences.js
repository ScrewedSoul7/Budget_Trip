import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const savePreferences = async (userId, preferences) => {
  try {
    await setDoc(doc(db, "users", userId), preferences, {merge: true });
    console.log("User preferences saved successfully!", preferences);
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
};