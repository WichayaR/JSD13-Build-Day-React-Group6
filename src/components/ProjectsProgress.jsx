function ProjectsProgress({ tasks = [] }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'Done').length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-green-800 text-sm">Progress</h2>
        <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">{done}/{total} Done</span>
      </div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-2xl font-black text-green-900">{pct}%</span>
        <span className="text-xs text-gray-500 font-medium">Sprint completion</span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
        <div className="h-full bg-green-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default ProjectsProgress
