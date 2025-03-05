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
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || !userDoc.data().selectedDestination) {
          throw new Error("No destination selected");
        }

        const { selectedDestination: destination, ...userData } = userDoc.data();
        
        // Fetch Weather
        const weatherRes = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=c82cd0bb0e5c4705ad5232413250103&q=${encodeURIComponent(destination)}`
        );
        if (!weatherRes.ok) throw new Error("Weather fetch failed");
        setWeather(await weatherRes.json());

        // Generate Itinerary
        const prompt = `Create a detailed ${userData.duration}-day itinerary for ${destination} with $${userData.budget} budget.
Include specific activities: ${userData.activities.join(", ")}.
Format as numbered days with clear sections for Morning, Afternoon, Evening.`;

        const itineraryRes = await fetch("https://api.fireworks.ai/inference/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FIREWORKS_API_KEY}`,
          },
          body: JSON.stringify({
            model: "accounts/fireworks/models/llama-v3-8b-instruct",
            prompt,
            max_tokens: 2000,
            temperature: 0.5,
            stream: false,
          }),
        });

        if (!itineraryRes.ok) throw new Error("Itinerary generation failed");
        const { choices } = await itineraryRes.json();
        
        if (!choices?.[0]?.text) throw new Error("Invalid itinerary format");
        setItinerary(processItineraryResponse(choices[0].text));

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processItineraryResponse = (text) => {
    const days = [];
    let currentDay = null;

    text.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .forEach(line => {
        const cleaned = line.replace(/[*\d+\.]/g, "").trim();
        
        // Detect day headers
        const dayMatch = cleaned.match(/^Day\s(\d+):?(.*)/i);
        if (dayMatch) {
          currentDay = {
            number: dayMatch[1],
            title: dayMatch[2] || `Day ${dayMatch[1]}`,
            sections: [],
          };
          days.push(currentDay);
          return;
        }

        // Detect time sections
        const timeMatch = cleaned.match(/^(Morning|Afternoon|Evening):?(.*)/i);
        if (timeMatch && currentDay) {
          currentDay.sections.push({
            time: timeMatch[1],
            content: timeMatch[2] ? [timeMatch[2]] : []
          });
          return;
        }

        // Add content to current section
        if (currentDay?.sections?.length > 0 && cleaned) {
          currentDay.sections[currentDay.sections.length - 1].content.push(cleaned);
        }
      });

    return days;
  };

  return (
    <section className="bg-cyan-50 text-[#1E3A5F] px-6 py-10 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center font-sans">Your Travel Plan</h2>
      
      {loading ? (
        <p className="text-center text-xl text-cyan-700">Building your dream itinerary...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium text-xl">{error}</p>
      ) : (
        <div className="space-y-8">
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
                  <p className="text-3xl font-bold text-cyan-600">
                    {weather.current.temp_c}°C
                  </p>
                  <p className="text-lg text-cyan-700">{weather.current.condition.text}</p>
                </div>
              </div>
            </div>
          )}

          {itinerary?.map((day) => (
            <div key={day.number} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-600 text-white rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {day.number}
                </div>
                <h3 className="text-2xl font-bold text-cyan-800">{day.title}</h3>
              </div>

              {day.sections.map((section) => (
                <div key={section.time} className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <h4 className="text-xl font-bold text-cyan-700">{section.time}</h4>
                  </div>
                  <div className="space-y-3 ml-8">
                    {section.content.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1.5">•</span>
                        <p className="text-lg text-cyan-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}