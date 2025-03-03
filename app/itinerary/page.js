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
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        // Generate Itinerary
        const itineraryPrompt = `Create a detailed ${userData.duration}-day itinerary for ${destination} with $${userData.budget} budget.
Include specific activities: ${userData.activities.join(", ")}.
Format as numbered days with clear sections for morning, afternoon, evening.`;

        const itineraryResponse = await fetch("https://api.fireworks.ai/inference/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREWORKS_API_KEY}`,
          },
          body: JSON.stringify({
            model: "accounts/fireworks/models/llama-v3-8b-instruct",
            prompt: itineraryPrompt,
            max_tokens: 500,
            temperature: 0.5,
          }),
        });

        const itineraryData = await itineraryResponse.json();
        const formattedItinerary = itineraryData.choices[0].text
          .split("\n")
          .filter(line => line.trim().length > 0);

        setItinerary(formattedItinerary);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-white text-navy px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Trip Plan</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {weather?.current && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Current Weather in {weather.location.name}
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={`https:${weather.current.condition.icon}`}
                  alt="Weather"
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-2xl font-bold">{weather.current.temp_c}°C</p>
                  <p>{weather.current.condition.text}</p>
                </div>
              </div>
            </div>
          )}

          {itinerary && (
            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Travel Itinerary</h3>
              <div className="space-y-4">
                {itinerary.map((line, index) => (
                  <div key={index} className="border-l-4 border-cyan-400 pl-4">
                    {line.replace(/^\d+\.\s*/, '').trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}