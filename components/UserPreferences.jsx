"use client";
import { useState, useEffect } from "react";
import { auth } from "../backend/firebase";
import { savePreferences } from "@/backend/savePreferences";
import getPreferences from "@/backend/getPreferences";
import { BudgetSetter } from "./Preferences/BudgetSetter";
import { DurationSlider } from "./Preferences/DurationSlider";
import { ClimateSelector } from "./Preferences/ClimateSelector";
import { FlightClassSelector } from "./Preferences/FlightClassSelector";
import { ActivitiesSelector } from "./Preferences/ActivitiesSelector";
import { useRouter } from "next/navigation";

export default function UserPreferences() {
  const [preferences, setPreferences] = useState({
    budget: "1000", 
    duration: "3", 
    climate: "Any", 
    flightClass: "Economy", 
    activities: [], 
  });

  const router = useRouter()

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const savedPreferences = await getPreferences(user.uid);
        if (savedPreferences) {
          setPreferences(savedPreferences);
        }
      }
    };
    fetchPreferences();
  }, []);

  const handleChange = (event) => {
    if (!event || !event.target) return;
    const { name, value, type, checked } = event.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
          ? [...prev.activities, value]
          : prev.activities.filter((activity) => activity !== value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {

      console.log("User not logged in");
      return;
    }
    try {
      await savePreferences(user.uid, preferences);
      console.log("Preferences saved successfully!", preferences);
      router.push("/select-destination");  
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <section className="bg-white text-navy px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Plan Your Trip</h2>
      
      <BudgetSetter budget={preferences.budget} handleChange={handleChange} />
      <DurationSlider duration={preferences.duration} handleChange={handleChange} />
      <ClimateSelector climate={preferences.climate} handleChange={handleChange} />
      <FlightClassSelector flightClass={preferences.flightClass} handleChange={handleChange} />
      <ActivitiesSelector activities={preferences.activities} handleChange={handleChange} />

      <button
        onClick={handleSubmit}
        className="bg-cyan-400 text-white px-4 py-2 rounded-md w-full font-semibold mt-4 hover:bg-cyan-500 transition"
      >
        Get Trip Suggestions
      </button>
    </section>
  );
}