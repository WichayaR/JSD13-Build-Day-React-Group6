import TaskItem from './TaskItem'
function RoleColumn({ status, tasks, onDelete, onStatusChange }) {
  return (
    <div className="bg-white/80 p-4 rounded-xl shadow border min-h-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">{status}</h2>
        <span className="bg-[#FFCA26] px-2 py-0.5 rounded-full text-xs font-bold">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center py-6 text-sm">ไม่มีงาน</p>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))
      )}
    </div>
  )
}

export default RoleColumn