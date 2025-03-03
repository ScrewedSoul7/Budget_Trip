"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/backend/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SelectDestination() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data();
          
          const prompt = `Suggest exactly 3 specific travel destinations for a budget trip.
Budget: $${prefs.budget}
Duration: ${prefs.duration} days
Climate: ${prefs.climate}
Activities: ${prefs.activities.join(", ")}
Return ONLY destination names, each on separate lines, no numbers or explanations.`;

          const response = await fetch("https://api.fireworks.ai/inference/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREWORKS_API_KEY}`,
            },
            body: JSON.stringify({
              model: "accounts/fireworks/models/llama-v3-8b-instruct",
              prompt: prompt,
              max_tokens: 100,
              temperature: 0.7,
            }),
          });

          const data = await response.json();
          let destinationList = data.choices[0].text
            .split("\n")
            .map(line => line
              .replace(/^\s*\d+\.?\s*/, '') // Remove numbers
              .replace(/[-•*]/g, '')        // Remove bullets
              .split(/[,(]/)[0]             // Take text before any punctuation
              .trim()
            )
            .filter(line => line && !line.match(/here are|suggestion|destination/i))
            .slice(0, 3);

          setDestinations(destinationList.filter(Boolean));
        }
      } catch (error) {
        console.error("Error:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSelectDestination = async (destination) => {
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { selectedDestination: destination },
        { merge: true }
      );
      router.push("/itinerary");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <section className="bg-white text-navy px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Select Destination</h2>
      {loading ? (
        <p className="text-center">Loading destinations...</p>
      ) : destinations.length > 0 ? (
        <div className="flex flex-col gap-4">
          {destinations.map((destination, index) => (
            <button
              key={index}
              onClick={() => handleSelectDestination(destination)}
              className="bg-cyan-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-500 transition"
            >
              {destination}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center">No destinations found. Please try again.</p>
      )}
    </section>
  );
}