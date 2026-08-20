function ProjectProgress({ tasks }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'Done').length
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-amber-50">
      <h2 className="text-lg font-bold text-lime-900 mb-2">Progress</h2>
      <div className="flex justify-between mb-1">
        <span className="font-bold text-lime-900">{percentage}%</span>
        <span className="text-sm text-gray-500">{done}/{total} done</span>
      </div>
      <div className="w-full bg-amber-50 rounded-full h-3">
        <div
          className="h-full bg-linear-to-r from-lime-400 to-lime-900 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProjectProgress