import { useState, useEffect } from 'react'

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
const STATUSES = ['To do', 'Doing', 'Done']

function AddTaskForm({
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onCancel,
  members,
  roles,
  editingTask,
  initialStatus = 'To do',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: members[0] || '',
    role: roles[0] || '',
    priority: 'Medium',
    status: initialStatus,
    dueDate: '',
    attachment: '',
  })

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        assignee: editingTask.assignee || members[0] || '',
        role: editingTask.role || roles[0] || '',
        priority: editingTask.priority || 'Medium',
        status: editingTask.status || initialStatus,
        dueDate: editingTask.dueDate || '',
        attachment: editingTask.attachment || '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        assignee: members[0] || '',
        role: roles[0] || '',
        priority: 'Medium',
        status: initialStatus,
        dueDate: '',
        attachment: '',
      })
    }
  }, [editingTask, members, roles, initialStatus])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingTask) {
      onUpdateTask({ ...editingTask, ...formData })
    } else {
      onAddTask(formData)
    }

    setFormData({
      title: '',
      description: '',
      assignee: members[0] || '',
      role: roles[0] || '',
      priority: 'Medium',
      status: initialStatus,
      dueDate: '',
      attachment: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
      <h2 className="text-lg font-bold text-green-900 mb-3">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full mb-2 p-2 rounded-lg border border-stone-200"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full mb-2 p-2 rounded-lg border border-stone-200"
        rows={2}
      />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <select name="assignee" value={formData.assignee} onChange={handleChange} className="p-2 rounded-lg border border-stone-200">
          {members.map((m) => <option key={m}>{m}</option>)}
        </select>

        <select name="role" value={formData.role} onChange={handleChange} className="p-2 rounded-lg border border-stone-200">
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange} className="p-2 rounded-lg border border-stone-200">
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select name="status" value={formData.status} onChange={handleChange} className="p-2 rounded-lg border border-stone-200">
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="p-2 rounded-lg border border-stone-200" />

        <input
          name="attachment"
          value={formData.attachment}
          onChange={handleChange}
          placeholder="Attachment link"
          className="p-2 rounded-lg border border-stone-200"
        />
      </div>

      <div className="flex gap-2">
        {editingTask && onDeleteTask && (
          <button
            type="button"
            onClick={() => onDeleteTask(editingTask.id)}
            className="py-2 px-3 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700"
          >
            Delete
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 font-bold rounded-lg text-xs text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="flex-1 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg">
          {editingTask ? 'Save' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}

export default AddTaskForm
