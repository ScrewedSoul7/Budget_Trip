export function BudgetSetter({ budget, handleChange }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="block text-lg font-medium">Enter Your Budget: $</label>
      <input
        type="number"
        name="budget"
        value={budget}
        min="200"
        onChange={handleChange}
        className="w-3/5 p-2 border rounded"
      />
    </div>
  );
}