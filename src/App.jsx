import { useState, useEffect } from 'react'
import AddTaskForm from './components/AddTaskForm'
import MemberFilter from './components/MembersFilter'
import ProjectProgress from './components/ProjectsProgress'
import RoleColumn from './components/RolesColumn'

const MEMBERS = ['Charnon', 'Focus', 'Heinz', 'Tony', 'Touch']
const ROLES = ['UI/UX', 'Frontend', 'Backend', 'Database']
const STATUSES = ['To do', 'Doing', 'Done']

function App() {
  // 1. ดึงข้อมูลจาก LocalStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้น
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'ทำ UI Mockup', assignee: 'Tony', role: 'UI/UX', status: 'Doing', priority: 'High', dueDate: '2026-08-25' },
      { id: '2', title: 'Setup React Project', assignee: 'Charnon', role: 'Frontend', status: 'Done', priority: 'Medium', dueDate: '2026-08-22' }
    ]
  })

  const [filterMember, setFilterMember] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // 2. เซฟลง LocalStorage ทุกครั้งที่ tasks เปลี่ยน
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // 3. ฟังก์ชัน เพิ่ม/ลบ/เปลี่ยนสถานะ
  const addTask = (newTask) => setTasks([...tasks, { ...newTask, id: Date.now().toString() }])
  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id))
  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  // 4. กรองข้อมูลสำหรับแสดงผล
  const filteredTasks = tasks.filter((t) => {
    const matchMember = filterMember === 'All' || t.assignee === filterMember
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchMember && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6 text-[#195328]">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">Task Board App</h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AddTaskForm onAddTask={addTask} members={MEMBERS} roles={ROLES} />
        <MemberFilter
          members={MEMBERS}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterMember={filterMember}
          onFilterChange={setFilterMember}
        />
        <ProjectProgress tasks={tasks} />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <RoleColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((t) => t.status === status)}
            onDelete={deleteTask}
            onStatusChange={updateStatus}
          />
        ))}
      </div>
    </div>
  )
}

export default App