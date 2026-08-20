import { useState, useEffect } from 'react'
import AddTaskForm from './components/AddTaskForm'
import MembersFilter from './components/MembersFilter'
import ProjectsProgress from './components/ProjectsProgress'
import TaskBoard from './components/TaskBoard'

const STORAGE_KEY = 'buildday-group6-data-v2'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

const createSeedData = () => {
  const sprintId = uid()
  return {
    groupName: 'GROUP PROJECT 6 - KINNAREE KHI HONDA',
    members: ['Charnon', 'Focus', 'Heinz', 'Tony', 'Touch'],
    roles: ['UI/UX', 'Frontend', 'Backend', 'Database', 'QA'],
    sprints: [
      {
        id: sprintId,
        name: 'Sprint 1',
        weeks: [
          {
            id: uid(),
            name: 'Week 1',
            days: [
              { date: '2026-08-07', tasks: [] },
              { date: '2026-08-08', tasks: [] },
              { date: '2026-08-09', tasks: [] },
              { date: '2026-08-10', tasks: [] },
              { date: '2026-08-11', tasks: [] },
            ],
          },
        ],
      },
    ],
    teams: [
      { id: uid(), name: 'UI/UX', checklist: [] },
      { id: uid(), name: 'Frontend', checklist: [] },
      { id: uid(), name: 'Backend', checklist: [] },
      { id: uid(), name: 'QA', checklist: [] },
    ],
    activeSprintId: sprintId,
  }
}

function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (err) {
      return createSeedData()
    }
    return createSeedData()
  })

  const [activeView, setActiveView] = useState('planner')
  const [filterMember, setFilterMember] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskContext, setTaskContext] = useState(null)

  const [addSprintModalOpen, setAddSprintModalOpen] = useState(false)
  const [newSprintName, setNewSprintName] = useState('')

  const [renameSprintModalOpen, setRenameSprintModalOpen] = useState(false)
  const [renameSprintName, setRenameSprintName] = useState('')

  const [addWeekModalOpen, setAddWeekModalOpen] = useState(false)
  const [newWeekName, setNewWeekName] = useState('')

  const [groupSettingsModalOpen, setGroupSettingsModalOpen] = useState(false)
  const [newMemberInput, setNewMemberInput] = useState('')
  const [newRoleInput, setNewRoleInput] = useState('')
  const [newChecklistText, setNewChecklistText] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const activeSprint = data.sprints.find((s) => s.id === data.activeSprintId) || data.sprints[0]

  const allTasks = []
  activeSprint?.weeks.forEach((w) => {
    w.days.forEach((d) => {
      d.tasks.forEach((t) => allTasks.push(t))
    })
  })

  const openAddTaskModal = (weekId = null, dayIdx = 0) => {
    if (!activeSprint) return
    const targetWeek = activeSprint.weeks.find((w) => w.id === weekId) || activeSprint.weeks[0]
    setTaskContext({ weekId: targetWeek.id, dayIdx, task: null })
    setTaskModalOpen(true)
  }

  const openEditTaskModal = (task) => {
    let found = null
    activeSprint?.weeks.forEach((w) => {
      w.days.forEach((d, dIdx) => {
        if (d.tasks.some((t) => t.id === task.id)) {
          found = { weekId: w.id, dayIdx: dIdx, task }
        }
      })
    })
    setTaskContext(found || { weekId: activeSprint?.weeks[0]?.id, dayIdx: 0, task })
    setTaskModalOpen(true)
  }

  const handleAddTask = (formData) => {
    if (!activeSprint) return
    const targetWeekId = taskContext?.weekId || activeSprint.weeks[0]?.id
    const targetDayIdx = taskContext?.dayIdx ?? 0
    const newTask = { id: uid(), ...formData }
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => {
        if (s.id !== activeSprint.id) return s
        return {
          ...s,
          weeks: s.weeks.map((w) => {
            if (w.id !== targetWeekId) return w
            return {
              ...w,
              days: w.days.map((d, idx) =>
                idx === targetDayIdx ? { ...d, tasks: [...d.tasks, newTask] } : d
              ),
            }
          }),
        }
      }),
    }))
    closeTaskModal()
  }

  const handleUpdateTask = (updatedTask) => {
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => ({
        ...s,
        weeks: s.weeks.map((w) => ({
          ...w,
          days: w.days.map((d) => ({
            ...d,
            tasks: d.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          })),
        })),
      })),
    }))
    closeTaskModal()
  }

  const handleDeleteTask = (taskId) => {
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => ({
        ...s,
        weeks: s.weeks.map((w) => ({
          ...w,
          days: w.days.map((d) => ({
            ...d,
            tasks: d.tasks.filter((t) => t.id !== taskId),
          })),
        })),
      })),
    }))
  }

  const handleStatusChange = (taskId, newStatus) => {
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => ({
        ...s,
        weeks: s.weeks.map((w) => ({
          ...w,
          days: w.days.map((d) => ({
            ...d,
            tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          })),
        })),
      })),
    }))
  }

  const closeTaskModal = () => {
    setTaskModalOpen(false)
    setTaskContext(null)
  }

  const handleQuickAddTask = (formData) => {
    if (!activeSprint) return
    const firstWeek = activeSprint.weeks[0]
    if (!firstWeek) return
    const newTask = { id: uid(), ...formData }
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => {
        if (s.id !== activeSprint.id) return s
        return {
          ...s,
          weeks: s.weeks.map((w) =>
            w.id === firstWeek.id
              ? { ...w, days: w.days.map((d, idx) => (idx === 0 ? { ...d, tasks: [...d.tasks, newTask] } : d)) }
              : w
          ),
        }
      }),
    }))
  }

  const handleAddSprint = (e) => {
    e.preventDefault()
    const name = newSprintName.trim()
    if (!name) return
    const newSprint = {
      id: uid(),
      name,
      weeks: [
        {
          id: uid(),
          name: 'Week 1',
          days: [
            { date: '', tasks: [] },
            { date: '', tasks: [] },
            { date: '', tasks: [] },
            { date: '', tasks: [] },
            { date: '', tasks: [] },
          ],
        },
      ],
    }
    setData((prev) => ({
      ...prev,
      sprints: [...prev.sprints, newSprint],
      activeSprintId: newSprint.id,
    }))
    setNewSprintName('')
    setAddSprintModalOpen(false)
  }

  const handleRenameSprint = (e) => {
    e.preventDefault()
    const name = renameSprintName.trim()
    if (!name || !activeSprint) return
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => (s.id === activeSprint.id ? { ...s, name } : s)),
    }))
    setRenameSprintName('')
    setRenameSprintModalOpen(false)
  }

  const handleDeleteSprint = () => {
    if (!activeSprint) return
    if (data.sprints.length <= 1) {
      alert('Must have at least one sprint')
      return
    }
    if (!window.confirm(`Delete ${activeSprint.name}?`)) return
    const remaining = data.sprints.filter((s) => s.id !== activeSprint.id)
    setData((prev) => ({ ...prev, sprints: remaining, activeSprintId: remaining[0].id }))
  }

  const handleAddWeek = (e) => {
    e.preventDefault()
    const name = newWeekName.trim()
    if (!name || !activeSprint) return
    const newWeek = {
      id: uid(),
      name,
      days: [
        { date: '', tasks: [] },
        { date: '', tasks: [] },
        { date: '', tasks: [] },
        { date: '', tasks: [] },
        { date: '', tasks: [] },
      ],
    }
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) =>
        s.id === activeSprint.id ? { ...s, weeks: [...s.weeks, newWeek] } : s
      ),
    }))
    setNewWeekName('')
    setAddWeekModalOpen(false)
  }

  const handleDeleteWeek = (weekId) => {
    if (!activeSprint) return
    if (activeSprint.weeks.length <= 1) {
      alert('Must have at least one week')
      return
    }
    if (!window.confirm('Delete this week?')) return
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) =>
        s.id === activeSprint.id ? { ...s, weeks: s.weeks.filter((w) => w.id !== weekId) } : s
      ),
    }))
  }

  const handleRenameWeek = (weekId, currentName) => {
    const name = window.prompt('Rename week:', currentName)
    if (!name || !name.trim()) return
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => {
        if (s.id !== activeSprint.id) return s
        return {
          ...s,
          weeks: s.weeks.map((w) => (w.id === weekId ? { ...w, name: name.trim() } : w)),
        }
      }),
    }))
  }

  const handleDateChange = (weekId, dayIdx, newDate) => {
    setData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) => {
        if (s.id !== activeSprint.id) return s
        return {
          ...s,
          weeks: s.weeks.map((w) => {
            if (w.id !== weekId) return w
            return {
              ...w,
              days: w.days.map((d, idx) => (idx === dayIdx ? { ...d, date: newDate } : d)),
            }
          }),
        }
      }),
    }))
  }

  const handleAddMember = () => {
    const name = newMemberInput.trim()
    if (!name || data.members.includes(name)) return
    setData((prev) => ({ ...prev, members: [...prev.members, name] }))
    setNewMemberInput('')
  }

  const handleRemoveMember = (name) => {
    if (data.members.length <= 1) {
      alert('Must have at least one member')
      return
    }
    setData((prev) => ({ ...prev, members: prev.members.filter((m) => m !== name) }))
  }

  const handleAddRole = () => {
    const name = newRoleInput.trim()
    if (!name || data.roles.includes(name)) return
    setData((prev) => ({ ...prev, roles: [...prev.roles, name] }))
    setNewRoleInput('')
  }

  const handleRemoveRole = (name) => {
    if (data.roles.length <= 1) {
      alert('Must have at least one role')
      return
    }
    setData((prev) => ({ ...prev, roles: prev.roles.filter((r) => r !== name) }))
  }

  const handleAddTeam = () => {
    const name = window.prompt('Team name:', 'New Team')
    if (!name || !name.trim()) return
    setData((prev) => ({
      ...prev,
      teams: [...prev.teams, { id: uid(), name: name.trim(), checklist: [] }],
    }))
  }

  const handleRemoveTeam = (teamId) => {
    if (!window.confirm('Delete this team?')) return
    setData((prev) => ({ ...prev, teams: prev.teams.filter((t) => t.id !== teamId) }))
  }

  const handleToggleChecklist = (teamId, itemId) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c
              ),
            }
          : t
      ),
    }))
  }

  const handleAddChecklistItem = (teamId) => {
    const text = newChecklistText[teamId]?.trim()
    if (!text) return
    setData((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, checklist: [...t.checklist, { id: uid(), text, done: false }] } : t
      ),
    }))
    setNewChecklistText((prev) => ({ ...prev, [teamId]: '' }))
  }

  const handleRemoveChecklistItem = (teamId, itemId) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId) } : t
      ),
    }))
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-6 text-green-900">
      <div className="max-w-7xl mx-auto space-y-5">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-200 pb-3 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-orange-500 uppercase tracking-wider">
                {data.groupName}
              </span>
              <button
                onClick={() => setGroupSettingsModalOpen(true)}
                className="text-xs bg-yellow-400 text-green-900 px-2 py-0.5 rounded font-bold hover:bg-yellow-500 transition"
              >
                Group Profile
              </button>
            </div>
            <h1 className="text-3xl font-extrabold text-green-900 tracking-tight mt-1">Sprint Board</h1>
            <p className="text-xs text-gray-500 font-medium">
              {activeSprint?.name} (Members: {data.members.join(', ')})
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setActiveView('planner')}
              className={`px-3 py-1.5 rounded-lg ${
                activeView === 'planner' ? 'bg-yellow-400 text-green-900' : 'text-gray-600 hover:text-green-900'
              }`}
            >
              Weekly Planner
            </button>
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-1.5 rounded-lg ${
                activeView === 'kanban' ? 'bg-yellow-400 text-green-900' : 'text-gray-600 hover:text-green-900'
              }`}
            >
              Kinnaree Board
            </button>
            <button
              onClick={() => setActiveView('teams')}
              className={`px-3 py-1.5 rounded-lg ${
                activeView === 'teams' ? 'bg-yellow-400 text-green-900' : 'text-gray-600 hover:text-green-900'
              }`}
            >
              Team Boards
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-stone-200 text-xs font-bold">
          <div className="flex gap-2 items-center flex-wrap">
            <label className="text-gray-500 font-semibold">Sprint:</label>
            <select
              value={data.activeSprintId}
              onChange={(e) => setData((prev) => ({ ...prev, activeSprintId: e.target.value }))}
              className="p-1.5 rounded-lg bg-stone-100 border border-stone-200 text-green-900 font-bold cursor-pointer"
            >
              {data.sprints.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setNewSprintName(`Sprint ${data.sprints.length + 1}`)
                setAddSprintModalOpen(true)
              }}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-green-900 hover:bg-gray-50 transition"
            >
              Add Sprint
            </button>
            <button
              onClick={() => {
                setRenameSprintName(activeSprint?.name || '')
                setRenameSprintModalOpen(true)
              }}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Rename
            </button>
            <button
              onClick={handleDeleteSprint}
              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => openAddTaskModal()}
              className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition shadow-sm"
            >
              Add Task
            </button>
            {activeView === 'planner' && (
              <button
                onClick={() => {
                  setNewWeekName(`Week ${activeSprint?.weeks.length + 1}`)
                  setAddWeekModalOpen(true)
                }}
                className="px-4 py-2 bg-yellow-400 text-green-900 rounded-lg hover:bg-yellow-500 transition shadow-sm"
              >
                Add Week
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AddTaskForm
            onAddTask={handleQuickAddTask}
            onUpdateTask={handleUpdateTask}
            members={data.members}
            roles={data.roles}
            editingTask={null}
          />
          <MembersFilter
            members={data.members}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterMember={filterMember}
            onFilterChange={setFilterMember}
          />
          <ProjectsProgress tasks={allTasks} />
        </div>

        <TaskBoard
          data={data}
          activeView={activeView}
          filterMember={filterMember}
          searchQuery={searchQuery}
          onOpenAddTaskModal={openAddTaskModal}
          onOpenEditTaskModal={openEditTaskModal}
          onStatusChange={handleStatusChange}
          onDeleteTask={handleDeleteTask}
          onRenameWeek={handleRenameWeek}
          onDeleteWeek={handleDeleteWeek}
          onDateChange={handleDateChange}
          newChecklistText={newChecklistText}
          setNewChecklistText={setNewChecklistText}
          onAddTeam={handleAddTeam}
          onRemoveTeam={handleRemoveTeam}
          onToggleChecklist={handleToggleChecklist}
          onAddChecklistItem={handleAddChecklistItem}
          onRemoveChecklistItem={handleRemoveChecklistItem}
        />

        {taskModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-lg">
              <AddTaskForm
                editingTask={taskContext?.task || null}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onCancel={closeTaskModal}
                members={data.members}
                roles={data.roles}
                initialStatus="To do"
              />
              {taskContext?.task && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      handleDeleteTask(taskContext.task.id)
                      closeTaskModal()
                    }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-sm hover:bg-red-200"
                  >
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {addSprintModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleAddSprint}
              className="bg-white p-5 rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm space-y-3 text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <h3 className="font-bold text-green-900 text-base">Add Sprint</h3>
                <button
                  type="button"
                  onClick={() => setAddSprintModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  X
                </button>
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Sprint Name</label>
                <input
                  type="text"
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSprintModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 font-bold rounded-lg text-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-500">
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        )}

        {renameSprintModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleRenameSprint}
              className="bg-white p-5 rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm space-y-3 text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <h3 className="font-bold text-green-900 text-base">Rename Sprint</h3>
                <button
                  type="button"
                  onClick={() => setRenameSprintModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  X
                </button>
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">New Sprint Name</label>
                <input
                  type="text"
                  value={renameSprintName}
                  onChange={(e) => setRenameSprintName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameSprintModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 font-bold rounded-lg text-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-500">
                  Save Name
                </button>
              </div>
            </form>
          </div>
        )}

        {addWeekModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleAddWeek}
              className="bg-white p-5 rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm space-y-3 text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <h3 className="font-bold text-green-900 text-base">Add Week</h3>
                <button
                  type="button"
                  onClick={() => setAddWeekModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  X
                </button>
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Week Name</label>
                <input
                  type="text"
                  value={newWeekName}
                  onChange={(e) => setNewWeekName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddWeekModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 font-bold rounded-lg text-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-500">
                  Add Week
                </button>
              </div>
            </form>
          </div>
        )}

        {groupSettingsModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-stone-200 w-full max-w-md space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <h2 className="font-bold text-green-900 text-base">Group Profile Settings</h2>
                <button
                  onClick={() => setGroupSettingsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm"
                >
                  X
                </button>
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Group Project Name</label>
                <input
                  type="text"
                  value={data.groupName}
                  onChange={(e) => setData((prev) => ({ ...prev, groupName: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-stone-200 font-bold text-sm text-green-900"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">
                  Team Members ({data.members.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {data.members.map((m) => (
                    <span
                      key={m}
                      className="bg-green-100 text-green-900 px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                    >
                      {m}
                      <button
                        onClick={() => handleRemoveMember(m)}
                        className="hover:text-red-600 text-xs ml-1 font-extrabold"
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add member..."
                    value={newMemberInput}
                    onChange={(e) => setNewMemberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddMember()
                    }}
                    className="flex-1 p-2 rounded-lg border border-stone-200 outline-none"
                  />
                  <button
                    onClick={handleAddMember}
                    className="px-3 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg"
                  >
                    Add Member
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">
                  Roles ({data.roles.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {data.roles.map((r) => (
                    <span
                      key={r}
                      className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                    >
                      {r}
                      <button
                        onClick={() => handleRemoveRole(r)}
                        className="hover:text-red-600 text-xs ml-1 font-extrabold"
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add role..."
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddRole()
                    }}
                    className="flex-1 p-2 rounded-lg border border-stone-200 outline-none"
                  />
                  <button
                    onClick={handleAddRole}
                    className="px-3 py-2 bg-green-900 text-white font-bold rounded-lg"
                  >
                    Add Role
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <button
                  onClick={() => setGroupSettingsModalOpen(false)}
                  className="w-full py-2 bg-green-900 text-white font-bold rounded-lg text-xs hover:bg-green-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
