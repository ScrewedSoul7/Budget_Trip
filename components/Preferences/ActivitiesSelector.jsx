"use client";
import { useState } from "react";

export default function ActivitiesSelect({ activities, handleChange }) {
  const activityOptions = [
    "Sightseeing",
    "Hiking",
    "Water Sports",
    "Nightlife",
    "Shopping",
    "Cultural Experiences",
  ];

  // State to track "Other" checkbox and input
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherInput, setOtherInput] = useState("");

  // Function to handle adding custom activity
  const handleOtherChange = (e) => {
    setOtherInput(e.target.value);
  };

  const addOtherActivity = () => {
    if (otherInput.trim() !== "") {
      handleChange({ target: { name: "activities", value: otherInput } }); // Call parent function
      setOtherInput(""); // Reset input
      setIsOtherChecked(false); // Hide text box after adding
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Activities</label>
      <div className="flex gap-3 flex-wrap">
        {activityOptions.map((activity) => (
          <label key={activity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="activities"
              value={activity}
              checked={activities.includes(activity)}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <span>{activity}</span>
          </label>
        ))}

        {/* "Other" checkbox */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isOtherChecked}
            onChange={() => setIsOtherChecked(!isOtherChecked)}
            className="cursor-pointer"
          />
          <span>Other</span>
        </label>

        {/* Show input when "Other" is checked */}
        {isOtherChecked && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={otherInput}
              onChange={handleOtherChange}
              placeholder="Enter custom activity"
              className="border px-2 py-1"
            />
            <button
              onClick={addOtherActivity}
              className="bg-cyan-400 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}