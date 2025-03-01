"use client";

export default function DurationSlider({ duration, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Duration: {duration} days</label>
      <input
        type="range"
        name="duration"
        min="1"
        max="14"
        value={duration}
        onChange={handleChange}
        className="w-full cursor-pointer"
      />
    </div>
  );
}