"use client";

export default function ClimateSelector({value, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block font-medium">Preferred Climate</label>
      <select 
        value={value}
        onChange={handleChange}
        className="w-full p-2 border rounded-md">
        <option value= "Warm">Warm</option>
        <option value= "Cold">Cold</option>
        <option value= "Temperate">Temperate</option>
      </select>
    </div>
  )
}
