"use client";
import { useEffect, useState } from "react";
import getItinerary from "@/backend/getItinerary";
import { auth } from "@/backend/firebase";

const MyItinerary = () => {
  const [itinerary, setItinerary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryAndWeather = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not logged in");
        setLoading(false);
        return;
      }

      // Fetch itinerary
      const itineraryData = await getItinerary(user.uid);
      if (!itineraryData) {
        console.log("No itinerary found");
        setLoading(false);
        return;
      }
      setItinerary(itineraryData);

      // Fetch weather using the itinerary's destination
      try {
        const weatherResponse = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=c82cd0bb0e5c4705ad5232413250103&q=${itineraryData.destination}`
        );
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }

      setLoading(false);
    };

    fetchItineraryAndWeather();
  }, []);

  return (
    <section className="bg-white text-navy px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Itinerary</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : itinerary ? (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Destination: {itinerary.destination}</h3>
          <p><strong>Days:</strong> {itinerary.days}</p>
          <p><strong>Activities:</strong> {itinerary.activities.join(", ")}</p>

          {/* Weather Section */}
          {weather ? (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h4 className="text-xl font-semibold">Current Weather in {itinerary.destination}</h4>
              <p><strong>Temperature:</strong> {weather.current.temp_c}°C</p>
              <p><strong>Condition:</strong> {weather.current.condition.text}</p>
            </div>
          ) : (
            <p>Weather data unavailable.</p>
          )}
        </div>
      ) : (
        <p className="text-center">No itinerary found. Generate one from the homepage!</p>
      )}
    </section>
  );
};

export default MyItinerary;