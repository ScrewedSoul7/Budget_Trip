"use client";

export default function BudgetSlider ({ budget, handleChange }) {
  return (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Budget: ${budget}</label>
        <input
        type = "range" min = "200" max = "5000" step = "50"
        value = {budget}
        onChange={handleChange}
        className="w-full cursor-pointer"
        />
    </div>
  )
}
