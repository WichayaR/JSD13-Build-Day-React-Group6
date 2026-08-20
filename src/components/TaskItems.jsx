function TaskItem({ task, onDelete, onStatusChange }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border mb-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sm">{task.title}</h3>
        <button onClick={() => onDelete(task.id)} className="text-red-500 font-bold text-xs">✕</button>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 my-2">
        <span>👤 {task.assignee}</span>
        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{task.role}</span>
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        className="w-full text-xs p-1 border rounded"
      >
        <option value="To do">To do</option>
        <option value="Doing">Doing</option>
        <option value="Done">Done</option>
      </select>
    </div>
  )
}

export default TaskItem
