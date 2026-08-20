const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
  Urgent: 'bg-orange-100 text-orange-700',
}

function TaskItems({ task, onDelete, onStatusChange, onEdit }) {
  return (
    <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 mb-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-green-800">{task.title}</h3>
        <div className="flex gap-2 text-xs">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-green-800">Edit</button>
          <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-600">X</button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        <span className="bg-green-800 text-white text-xs px-2 py-0.5 rounded-full">{task.role}</span>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{task.assignee}</span>
        <span className={`${PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-700'} text-xs px-2 py-0.5 rounded-full`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{task.dueDate}</span>
        )}
      </div>

      {task.attachment && (
        <p className="text-xs text-gray-500 mt-1 truncate">{task.attachment}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold text-gray-500">{task.status}</span>
        <div className="flex gap-1">
          {['To do', 'Doing', 'Done'].map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(task.id, status)}
              className={`px-2 py-1 rounded text-xs font-bold ${task.status === status ? 'bg-yellow-400 text-green-900' : 'bg-white border border-gray-300 text-gray-500'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskItems
