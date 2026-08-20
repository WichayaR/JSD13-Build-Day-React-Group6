// ============================================================
// หน้าที่ของไฟล์นี้: แสดงการ์ดงาน 1 งาน (title, badges, ปุ่มลบ, ปุ่มเปลี่ยนสถานะ)
//
// ภาพรวมของโปรเจกต์ (Task Board App):
//   App.jsx เก็บ state กลางไว้ทั้งหมด:
//     - tasks            : รายการงาน (มี id, title, assignee, role, status, priority, dueDate)
//     - addTask / deleteTask / updateStatus : ฟังก์ชันแก้ไข tasks
//   จากนั้นส่งต่อให้ component ย่อยผ่าน props
//
// แผนผัง component และเจ้าของไฟล์:
//   src/App.jsx                       -> (วาง layout + state กลาง)
//     ├── src/components/AddTaskForm.jsx     (Charnon) ใช้ addTask  -> เพิ่มงาน
//     ├── src/components/MembersFilter.jsx   (Focus)    ใช้ filterMember/searchQuery
//     ├── src/components/ProjectsProgress.jsx(Heinz)    ใช้ tasks
//     └── src/components/RolesColumn.jsx     (Tony)     ใช้ tasks, onDelete, onStatusChange
//           └── src/components/TaskItems.jsx (Touch = ไฟล์นี้)
//               ใช้ shared state ผ่าน props ที่ RolesColumn ส่งมา:
//               - task           : งาน 1 รายการ (ข้อมูลที่ถูกกรอง/เปลี่ยนสถานะมาจาก App)
//               - onDelete       : เรียก App.deleteTask(id) เพื่อลบงาน
//               - onStatusChange : เรียก App.updateStatus(id, newStatus) เพื่อย้ายสถานะ
//
// หมายเหตุ: RolesColumn.jsx ตอนนี้ import `./TaskItem` (ชื่อไฟล์คนละชื่อกับที่นี่)
//           ชื่อไฟล์แก้ทีหลังได้เสมอ — สิ่งที่สำคัญคือ component นี้ต้องรับ props
//           task, onDelete, onStatusChange ตามที่ RolesColumn ส่งให้
// ============================================================

// STATUSES = รายชื่อสถานะทั้ง 3 แบบของงาน (ต้องตรงกับ STATUSES ใน App.jsx)
// ถูกใช้ใน .map() ด้านล่าง เพื่อสร้างปุ่มสลับสถานะในแต่ละการ์ด
// ปุ่มของสถานะปัจจุบันจะถูก highlight เป็นสีเหลือง
const STATUSES = ['To do', 'Doing', 'Done']

// PRIORITY_COLORS = ตาราง map ค่า priority -> class สีของ badge (Tailwind)
// ⚠️ สำคัญ: key ต้องตรงกับค่า priority ในข้อมูล tasks ทุกตัวอักษร (case-sensitive)
// เช่น ข้อมูลเขียน 'High' -> ตรงกับ key High และแสดงสีแดง
// แต่ถ้าเขียน 'high' -> ไม่ตรง key จะ fallback เป็นสีเทา (bg-gray-100)
const PRIORITY_COLORS = {
  High: 'bg-[#FEE2E2] text-[#B91C1C]',   // priority 'High'   -> พื้นแดงอ่อน (#FEE2E2) ตัวอักษรแดงเข้ม (#B91C1C)
  Medium: 'bg-[#FEF9C3] text-[#A16207]', // priority 'Medium' -> พื้นเหลืองอ่อน (#FEF9C3) ตัวอักษรน้ำตาลเข้ม (#A16207)
  Low: 'bg-[#DCFCE7] text-[#15803D]',    // priority 'Low'    -> พื้นเขียวอ่อน (#DCFCE7) ตัวอักษรเขียวเข้ม (#15803D)
}
// ※ เดิมบรรทัดนี้ใช้ชื่อสีแบบสำเร็จรูป (bg-red-100, bg-yellow-100, bg-green-100)
//   ซึ่ง browser แสดงผลถูกต้องอยู่แล้ว แต่ editor (VS Code) จะไม่แสดงกล่องโชว์สีให้
//   เหมือน class แบบ bg-[#195328] ที่เป็นค่า hex จึงเปลี่ยนเป็นค่า hex (bg-[#FEE2E2])
//   เพื่อให้เห็นกล่องสีใน editor และได้โทนสีเดียวกันกับ class สำเร็จรูปทุกประการ

// TaskItem = component ที่ใช้วาดการ์ดงาน 1 ใบ
// รับ props มาจาก RolesColumn:
//   - task           : ข้อมูลงาน 1 รายการ { id, title, assignee, role, status, priority, dueDate }
//   - onDelete       : ฟังก์ชันลบงาน (ต่อจาก App.deleteTask)
//   - onStatusChange : ฟังก์ชันเปลี่ยนสถานะ (ต่อจาก App.updateStatus)
function TaskItem({ task, onDelete, onStatusChange }) {
  return (
    // กล่องใบงาน: พื้นสีเบจอ่อน (#F5F1E8) เนื้อในเว้น 3 หน่วย ขอบโค้งมน เส้นขอบเทาอ่อน เว้นจากใบถัดไป 2 หน่วย
    <div className="bg-[#F5F1E8] p-3 rounded-lg border border-gray-200 mb-2">
      {/* แถวบน: จัดให้หัวข้ออยู่ซ้าย ปุ่มลบอยู่ขวา (flex + justify-between) */}
      <div className="flex justify-between items-start gap-2">
        {/* หัวข้อชื่องาน: ตัวหนา สีเขียวเข้ม (#195328) */}
        <h3 className="font-semibold text-[#195328]">{task.title}</h3>
        {/* ปุ่ม ✕ สำหรับลบงานนี้ */}
        <button
          onClick={() => onDelete(task.id)} // เมื่อคลิก -> เรียก onDelete พร้อมส่ง id เพื่อให้ App ลบงานออกจากลิสต์
          className="text-gray-400 hover:text-red-500 text-sm" // ปกติเป็นสีเทาอ่อน พอชี้เมาส์ (hover) เปลี่ยนเป็นแดง
          aria-label="Delete task" // ข้อความสำหรับ screen reader (ช่วยผู้ใช้ที่อ่านจอไม่ได้)
        >
          ✕
        </button>
      </div>

      {/* แถว badge (ป้ายเล็ก ๆ): flex-wrap ให้ไหลต่อกันและตัดบรรทัดลงมาได้ถ้าเต็ม */}
      <div className="flex flex-wrap gap-1 mt-2">
        {task.role && ( // ถ้า role มีค่าจริง (ไม่ใช่ undefined/null/'' ) ค่อยแสดง badge นี้
          <span className="bg-[#195328] text-white text-xs px-2 py-0.5 rounded-full">{task.role}</span> // badge สีเขียวเข้ม = ตำแหน่ง เช่น UI/UX
        )}
        {task.assignee && ( // ถ้า assignee มีค่าจริง ค่อยแสดง
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{task.assignee}</span> // badge สีฟ้า = ชื่อคนรับงาน
        )}
        {task.priority && ( // ถ้า priority มีค่าจริง ค่อยแสดง
          <span className={`${PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-700'} text-xs px-2 py-0.5 rounded-full`}>
            {/* ดึงสีจาก PRIORITY_COLORS ตามค่า priority; ถ้าไม่ตรง key ให้ใช้สีเทา (bg-gray-100) เป็น fallback */}
            {task.priority}
          </span>
        )}
        {task.dueDate && ( // ถ้า dueDate มีค่าจริง ค่อยแสดง
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">📅 {task.dueDate}</span> // badge เทา = กำหนดส่ง ขึ้นต้นด้วยไอคอน 📅
        )}
      </div>

      {/* แถวล่าง: ด้านซ้าย = สถานะปัจจุบัน, ด้านขวา = กลุ่มปุ่มสลับสถานะ */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold text-gray-500">{task.status}</span> {/* แสดงสถานะปัจจุบันของงาน */}
        <div className="flex gap-1"> {/* กลุ่มปุ่มสลับสถานะ */}
          {STATUSES.map((status) => ( // วนสร้างปุ่ม 1 อันต่อ 1 สถานะ (To do / Doing / Done)
            <button
              key={status} // key จำเป็นสำหรับลิสต์ใน React เพื่อให้ React แยกแต่ละปุ่มได้ถูกต้อง
              onClick={() => onStatusChange(task.id, status)} // กดปุ่มไหน -> เปลี่ยนงานนี้ไปเป็นสถานะนั้นทันที
              className={`px-2 py-1 rounded text-xs font-bold ${
                task.status === status // เช็คว่าปุ่มนี้คือสถานะปัจจุบันของงานหรือเปล่า
                  ? 'bg-[#FFCA26] text-[#195328]' // ถ้าใช่ -> พื้นเหลือง (#FFCA26) ตัวเขียวเข้ม = highlight
                  : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100' // ถ้าไม่ -> ปุ่มขาว ขอบเทา พอ hover พื้นเทาอ่อน
              }`}
            >
              {status} // ข้อความบนปุ่ม = ชื่อสถานะนั้น ๆ
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// export default ทำให้ไฟล์อื่น (RolesColumn) นำเข้า TaskItem ไปใช้ได้
export default TaskItem