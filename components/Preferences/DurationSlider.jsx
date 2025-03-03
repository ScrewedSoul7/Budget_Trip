export function DurationSlider({ duration, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block font-medium">Trip Duration (days)</label>
      <input
        type="number"
        name="duration"
        value={duration}
        min="1"
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
}