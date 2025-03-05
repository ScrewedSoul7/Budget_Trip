"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/backend/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists() || !docSnap.data().selectedDestination) {
          setError("No destination selected");
          setLoading(false);
          return;
        }

        const destination = docSnap.data().selectedDestination;
        const userData = docSnap.data();

        // Fetch Weather
        const weatherResponse = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=c82cd0bb0e5c4705ad5232413250103&q=${encodeURIComponent(destination)}`
        );
        
        if (!weatherResponse.ok) throw new Error("Weather fetch failed");
        setWeather(await weatherResponse.json());

        // Generate Itinerary
        const itineraryResponse = await fetch("https://api.fireworks.ai/inference/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FIREWORKS_API_KEY}`,
          },
          body: JSON.stringify({
            model: "accounts/fireworks/models/llama-v3-8b-instruct",
            prompt: `Create a detailed ${userData.duration}-day itinerary for ${destination} with $${userData.budget} budget.
              Include specific activities: ${userData.activities.join(", ")}.
              Format as numbered days with clear sections for morning, afternoon, evening.`,
            max_tokens: 1000,
            temperature: 0.5,
          }),
        });

        if (!itineraryResponse.ok) throw new Error("Failed to generate itinerary");
        const itineraryData = await itineraryResponse.json();
        
        // Clean and format itinerary text
        const cleanedItinerary = itineraryData.choices[0].text
          .split("\n")
          .map(line => line.replace(/\*/g, "").trim()) // Remove all asterisks
          .filter(line => line.length > 0);

        setItinerary(cleanedItinerary);

      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-cyan-50 text-[#1E3A5F] px-6 py-10 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center font-sans">Your Travel Plan</h2>
      
      {loading ? (
        <div className="text-center">
          <p className="text-xl text-cyan-700 animate-pulse">Crafting your perfect itinerary...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium text-xl">{error}</p>
      ) : (
        <div className="space-y-8">
          {/* Weather Card */}
          {weather?.current && (
            <div className="p-6 bg-white rounded-xl shadow-lg border border-cyan-100">
              <h3 className="text-2xl font-bold mb-4 text-cyan-800">
                Current Weather in {weather.location.name}
              </h3>
              <div className="flex items-center gap-6">
                <img
                  src={`https:${weather.current.condition.icon}`}
                  alt="Weather"
                  className="w-20 h-20"
                />
                <div>
                  <p className="text-3xl font-bold text-cyan-600">{weather.current.temp_c}°C</p>
                  <p className="text-lg text-cyan-700">{weather.current.condition.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Section */}
          {itinerary && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-cyan-800 text-center mb-6">
                Travel Itinerary
              </h3>
              
              <div className="space-y-6">
                {itinerary.map((line, index) => {
                  const isDayHeader = line.match(/^Day\s\d+/i);
                  const isTimeSection = line.match(/(Morning|Afternoon|Evening)/i);

                  return (
                    <div
                      key={index}
                      className={`
                        ${isDayHeader ? 'bg-cyan-600 text-white p-4 rounded-xl' : ''}
                        ${isTimeSection ? 'bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg mt-4' : ''}
                        ${!isDayHeader && !isTimeSection ? 'pl-6' : ''}
                        transition-all duration-200
                      `}
                    >
                      <div className={`
                        ${isDayHeader ? 'text-2xl font-bold' : ''}
                        ${isTimeSection ? 'text-xl font-semibold' : 'text-lg'}
                      `}>
                        {line.replace(/^\d+\.\s*/, '').trim()}
                      </div>
                      {isTimeSection && <div className="border-b-2 border-cyan-200 mt-2 w-16" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}