export function FlightClassSelector({ flightClass, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block font-medium">Flight Class</label>
      <select 
        name="flightClass"
        value={flightClass}
        onChange={handleChange}
        className="w-full border rounded p-2">
        <option value="Economy">Economy</option>
        <option value="Business">Business</option>
        <option value="First Class">First Class</option>
      </select>
    </div>
  );
}
