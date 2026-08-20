import {useState} from 'react'
const PRIORITIES = ['Low', 'Medium','High', 'Urgent']
function AddTaskForm({ onAddTask, members, roles}){
const [formData, setFormData] = useState({
    titile: '',
    description: '',
    assignee: members[0] || 'Charnon',
    role: roles[0] || 'UI/UX',
    priority: 'Medium',
    dueData: '',
    status:'To do', 
})}
const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
}
const handleSummit = (e) => {
    e.preventDafault()
    if (!formData.title.trim()) return
    
    onAddTask(formData)

    setFormdata({
        title: '',
        decscription: '',
        assignee: members[0] || 'Charnon',
        role: roles[0] || 'UI/UX',
        priority: 'Medium',
        dueData: '',
        status:'To do', 
    })
}

return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2x1 shadow-lg border-[#EBE6DA]">
        <h2 className="text-lg font-bold text-[#195328] mb-3">+ Add New Task </h2>

        <input
            name="titile"
            value={formData.title}
            onChange={handleChange}
            placeholder='Task title'
            required
        />
        <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        />
     <div className="grid grid-cols-2 gap-2"></div>

       <select name="assignee" value={formData.assignee} onChange={handleChange}>
          {members.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select name="role" value={formData.role} onChange={handleChange}>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="data" name="dueDate" value= {formData.dueData} onChange={handleChange} />
    
<button type="submit" className="mt-3 w-full py-2 bg-[#FFCA26] text-[#195328] font-bold rounded-lg">
        Add Task
      </button>
</form>
)