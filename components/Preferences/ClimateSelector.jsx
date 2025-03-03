export function ClimateSelector({ climate, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block font-medium">Preferred Climate</label>
      <select 
        name="climate"
        value={climate}
        onChange={handleChange}
        className="w-full p-2 border rounded-md">
        <option value="Any">Any</option>
        <option value="Warm">Warm</option>
        <option value="Cold">Cold</option>
        <option value="Temperate">Temperate</option>
      </select>
    </div>
  );
}