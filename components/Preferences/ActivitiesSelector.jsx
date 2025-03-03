export function ActivitiesSelector({ activities = [], handleChange }) {
  const activityOptions = ["Sightseeing", "Hiking", "Water Sports", "Nightlife", "Shopping"];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Activities</label>
      <div className="flex flex-wrap gap-3">
        {activityOptions.map((activity) => (
          <label key={activity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="activities"
              value={activity}
              checked={Array.isArray(activities) && activities.includes(activity)}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <span>{activity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
