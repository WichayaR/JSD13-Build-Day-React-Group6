import RolesColumn from './RolesColumn'
import TaskItems from './TaskItems'

const STATUSES = ['To do', 'Doing', 'Done']

function TaskBoard({
  data,
  activeView,
  filterMember,
  searchQuery,
  onOpenAddTaskModal,
  onOpenEditTaskModal,
  onStatusChange,
  onDeleteTask,
  onRenameWeek,
  onDeleteWeek,
  onDateChange,
  newChecklistText,
  setNewChecklistText,
  onAddTeam,
  onRemoveTeam,
  onToggleChecklist,
  onAddChecklistItem,
  onRemoveChecklistItem,
}) {
  const activeSprint = data.sprints.find((s) => s.id === data.activeSprintId) || data.sprints[0]

  const allTasks = []
  activeSprint?.weeks.forEach((w) => {
    w.days.forEach((d) => {
      d.tasks.forEach((t) => allTasks.push(t))
    })
  })

  const filteredTasks = allTasks.filter((t) => {
    const matchMember = filterMember === 'All' || t.assignee === filterMember
    const matchSearch =
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchMember && matchSearch
  })

  return (
    <>
      {activeView === 'planner' && (
        <div className="space-y-4">
          {activeSprint?.weeks.map((w) => (
            <div key={w.id} className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm">
              <div className="bg-green-900 text-white px-4 py-2.5 flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span>{w.name}</span>
                  <button
                    onClick={() => onRenameWeek(w.id, w.name)}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-200">
                    {w.days[0]?.date || ''} - {w.days[w.days.length - 1]?.date || ''}
                  </span>
                  <button
                    onClick={() => onDeleteWeek(w.id)}
                    className="text-xs text-red-300 hover:text-white"
                  >
                    Delete Week
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-200 overflow-x-auto p-2 bg-stone-50">
                {w.days.map((d, dIdx) => {
                  const dayTasks = d.tasks.filter(
                    (t) =>
                      (filterMember === 'All' || t.assignee === filterMember) &&
                      (searchQuery === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  return (
                    <div key={dIdx} className="flex-1 min-w-[200px] p-2">
                      <div className="flex justify-between items-center mb-2 pb-1 border-b border-stone-200">
                        <input
                          type="date"
                          value={d.date}
                          onChange={(e) => onDateChange(w.id, dIdx, e.target.value)}
                          className="font-mono text-xs font-bold text-orange-500 bg-transparent border border-stone-200 rounded px-1 py-0.5"
                        />
                        <button
                          onClick={() => onOpenAddTaskModal(w.id, dIdx)}
                          className="px-2 py-0.5 bg-yellow-400 text-green-900 rounded font-bold text-xs hover:bg-yellow-500"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1.5 min-h-[100px]">
                        {dayTasks.length === 0 ? (
                          <div className="text-gray-400 text-xs italic py-4 text-center">No tasks</div>
                        ) : (
                          dayTasks.map((t) => (
                            <TaskItems
                              key={t.id}
                              task={t}
                              onDelete={onDeleteTask}
                              onStatusChange={onStatusChange}
                              onEdit={onOpenEditTaskModal}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map((status) => (
            <RolesColumn
              key={status}
              status={status}
              tasks={filteredTasks.filter((t) => t.status === status)}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              onEdit={onOpenEditTaskModal}
            />
          ))}
        </div>
      )}

      {activeView === 'teams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.teams.map((t) => {
              const done = t.checklist.filter((c) => c.done).length
              const pct = t.checklist.length ? Math.round((done / t.checklist.length) * 100) : 0
              return (
                <div key={t.id} className="bg-white p-3 rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between font-bold text-green-900 mb-1">
                    <span>{t.name}</span>
                    <span className="font-mono text-orange-500">{pct}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.teams.map((t) => (
              <div key={t.id} className="bg-white p-3.5 rounded-2xl border border-stone-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                    <h3 className="font-bold text-green-900">{t.name}</h3>
                    <button onClick={() => onRemoveTeam(t.id)} className="text-gray-400 hover:text-red-600 font-bold">
                      X
                    </button>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {t.checklist.map((c) => (
                      <li key={c.id} className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={c.done}
                          onChange={() => onToggleChecklist(t.id, c.id)}
                          className="accent-green-800"
                        />
                        <span className={`flex-1 ${c.done ? 'line-through text-gray-400' : ''}`}>{c.text}</span>
                        <button onClick={() => onRemoveChecklistItem(t.id, c.id)} className="text-gray-300 hover:text-red-600">
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-1 pt-2 border-t border-gray-100">
                  <input
                    placeholder="Add item..."
                    value={newChecklistText[t.id] || ''}
                    onChange={(e) =>
                      setNewChecklistText((prev) => ({ ...prev, [t.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && onAddChecklistItem(t.id)}
                    className="flex-1 p-1.5 border border-stone-200 rounded text-xs outline-none"
                  />
                  <button
                    onClick={() => onAddChecklistItem(t.id)}
                    className="px-2.5 py-1.5 bg-yellow-400 text-green-900 font-bold rounded text-xs hover:bg-yellow-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={onAddTeam}
              className="border-2 border-dashed border-stone-200 hover:border-green-900 text-gray-400 hover:text-green-900 rounded-2xl min-h-[180px] flex items-center justify-center font-bold text-xs transition bg-white"
            >
              Add Team
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskBoard
