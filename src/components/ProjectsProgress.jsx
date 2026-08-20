function ProjectProgress({ tasks = [] }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'Done' || t.status === 'done').length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lime-700 text-sm">📊 Progress</h2>
        <span className="text-xs font-bold text-lime-600 bg-lime-800/10 px-2 py-0.5 rounded-full">{done}/{total} Done</span>
      </div>

      <div className="flex justify-between items-baseline mb-1">
        <span className="text-2xl font-black  text-lime-900">{pct}%</span>
        <span className="text-xs text-gray-400 font-medium">Sprint completion</span>
      </div>

      <div className="w-full  bg-amber-50 rounded-full h-3 overflow-hidden p-0.5">
        <div className="h-full bg-linear-to-r  from-lime-400  to-lime-900 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default ProjectProgress
