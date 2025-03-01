
export default function BudgetSetter({budget , setBudget }) {
  return (
    <div className="mb-4 flex items-center gap-2">
    <label className="block text-lg font-medium mb-1">Enter Your Budget: $</label>
    <input
      type="number"
      value={budget} 
      min="200"
      onChange={(e)=>setBudget(e.target.value)} 
      className="w-3/5 p-2 border rounded"

    />
    </div>
  )
}
