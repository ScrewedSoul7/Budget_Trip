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

  const processItinerary = (lines) => {
    const processed = [];
    let currentDay = null;
    
    lines.forEach((line) => {
      // Clean the line from numbering and markdown
      const cleaned = line
        .replace(/^\d+\.\s*/, '')
        .replace(/\*\*/g, '')
        .trim();

      // Detect day headers
      const dayMatch = cleaned.match(/^Day\s(\d+):/i);
      if (dayMatch) {
        currentDay = {
          number: dayMatch[1],
          sections: [],
        };
        processed.push(currentDay);
        return;
      }

      // Detect time sections
      const timeMatch = cleaned.match(/(Morning|Afternoon|Evening):/i);
      if (timeMatch && currentDay) {
        currentDay.sections.push({
          time: timeMatch[1],
          content: []
        });
        return;
      }

      // Add content to current section
      if (currentDay && currentDay.sections.length > 0 && cleaned) {
        currentDay.sections[currentDay.sections.length - 1].content.push(cleaned);
      }
    });

    return processed;
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
          {/* Weather section remains same */}

          {itinerary && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-cyan-800 text-center mb-6">
                Your Personalized Itinerary
              </h3>
              <div className="space-y-10">
                {processItinerary(itinerary).map((day) => (
                  <div key={day.number} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-cyan-600 text-white rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold">
                        {day.number}
                      </div>
                      <h3 className="text-2xl font-bold text-cyan-800">Day {day.number}</h3>
                    </div>

                    {day.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                          <h4 className="text-xl font-bold text-cyan-700">
                            {section.time}
                          </h4>
                        </div>
                        <div className="space-y-3 ml-8">
                          {section.content.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-3">
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
            </div>
          )}
        </div>
      )}
    </section>
  );
}