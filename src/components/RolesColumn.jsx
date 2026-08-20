import TaskItems from './TaskItems'

function RolesColumn({ status, tasks, onDelete, onStatusChange, onEdit }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 min-h-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-green-800">{status}</h2>
        <span className="bg-yellow-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center py-6 text-sm">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskItems
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  )
}

export default RolesColumn
