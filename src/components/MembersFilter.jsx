
    //console.log(props); // props มาจากคนเรียกใช้งาน component นี้ , membersFilter เป็น props ที่ส่งมาจาก component แม่ App.jsx  
    //props คือชื่อที่ตั้งเองว่าจะเรียกใช้งาน object ก้อนนั้นว่าอะไร 
    //<MemberFilter จาก app.jsx
  //members={MEMBERS}
  //searchQuery={searchQuery}
  //onSearchChange={setSearchQuery}
  //filterMember={filterMember}
  //onFilterChange={setFilterMember}
///> เบื้องหลัง React จะแปลงบรรทัดนี้ให้กลายเป็นการเรียกฟังก์ชันแบบนี้

function MembersFilter({ members, searchQuery, onSearchChange, filterMember, onFilterChange }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-[#EBE6DA]">
            <h2 className="text-lg font-bold text-[#195328] mb-3">Search & Filter</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search members..."
            />
            <select value={filterMember} onChange={(e) => onFilterChange(e.target.value)}>
                <option value="All">All Members</option>
                {members.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
        </div>
    )
}

export default MembersFilter

