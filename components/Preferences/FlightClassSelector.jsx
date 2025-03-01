"use client";

export default function FlightClassSelect({ flightClass, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Flight Class</label>
      <select
        name="flightClass"
        value={flightClass}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="firstClass">First Class</option>
      </select>
    </div>
  );
}
