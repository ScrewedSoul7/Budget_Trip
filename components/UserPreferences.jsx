"use client";
import { useState } from "react";
import DurationSlider from "./Preferences/DurationSlider";
import ClimateSelect from "./Preferences/ClimateSelector";
import FlightClassSelect from "./Preferences/FlightClassSelector";
import ActivitiesSelect from "./Preferences/ActivitiesSelector";
import BudgetSetter from "./Preferences/BudgetSetter";
import { savePreferences } from "@/backend/savePreferences";
import { auth } from "@/backend/firebase";
import { useEffect } from "react";
import getPreferences from "@/backend/getPreferences";
import getItinerary from "@/backend/getItinerary";
import { saveItinerary } from "@/backend/saveItinerary";


export default function UserPreferences() {
  const [preferences, setPreferences] = useState({
    budget: 1000,
    duration: 5,
    climate: "warm",
    flightClass: "economy",
    activities: [],
  })

  //Retrieve preferences if user is logged in and has saved preferences
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

    fetchPreferences()
  }, [auth.currentUser])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setPreferences((prev) => ({
        ...prev,
        activities: checked
          ? [...prev.activities, value]
          : prev.activities.filter((activity) => activity !== value),
      }));
    } else {
      setPreferences((prev) => ({ ...prev, [name]: value }));
    }
  }

  //save user preferences in database for access by API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
  
    if (!user) {
      console.log("User not logged in");
      return;
    }
  
    try {
      // Save user preferences
      await savePreferences(user.uid, preferences);
      console.log("User preferences saved successfully!");
  
      // Save a sample itinerary (replace later with API-generated data)
      const sampleItinerary = {
        destination: "Paris",
        days: preferences.duration, // Use actual user preference
        estimatedCost: 800,
        activities: preferences.activities.length > 0 ? preferences.activities : ["Sightseeing"],
      };
      await saveItinerary(user.uid, sampleItinerary);
      console.log("Itinerary saved successfully!");
  
      // Fetch the itinerary to verify
      const itinerary = await getItinerary(user.uid);
      console.log("Fetched itinerary:", itinerary);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <section className="bg-white text-navy px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Plan Your Trip</h2>

      <BudgetSetter budget={preferences.budget} setBudget={handleChange} />
      <DurationSlider duration={preferences.duration} handleChange={handleChange} />
      <ClimateSelect climate={preferences.climate} handleChange={handleChange} />
      <FlightClassSelect flightClass={preferences.flightClass} handleChange={handleChange} />
      <ActivitiesSelect activities={preferences.activities} handleChange={handleChange} />

      <button onClick= {handleSubmit} className="bg-cyan-400 text-white px-4 py-2 rounded-md w-full font-semibold mt-4 cursor-pointer hover:bg-cyan-500 transition">
        Get Trip Suggestions
      </button>
    </section>
  );
}