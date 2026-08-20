

// ฟังก์ชัน MembersFilter ใช้สำหรับกรองสมาชิกตามเงื่อนไขที่กำหนด โดยรับ props ที่ประกอบด้วย members, searchQuery และ filteredMembers
function MembersFilter(props) {
    let members ;
    if (props.members) {
        members = props.members 
    } else {
        members = [];
    }

    let searchQuery = props.searchQuery;
    if (props.searchQuery) {
        searchQuery = props.searchQuery;
    } else {
        searchQuery = '';
    }

    let filteredMembers;
    if (props.filteredMembers) {
        filteredMembers = props.filteredMembers;
    } else {
        filteredMembers = 'All Members';
    }
    }

    function handleSearchChange(event) {
    if (props.onSearchChange) {
      props.onSearchChange(event.target.value);
    } else {
      }
    }

    function handleFilterChange(e) {
    if (props.onFilterChange) {
      props.onFilterChange(e.target.value);
    } else {
    }
    }

    const memberOptions = [];
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    memberOptions.push(
      <option key={m} value={m}>{m}</option>
    );
    }

return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#EBE6DA]">
      <h2 className="font-bold text-[#195328] text-sm mb-2">Search & Filter</h2>
      <div className="space-y-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className="w-full p-2 text-xs rounded-lg border border-[#EBE6DA] focus:outline-none focus:ring-1 focus:ring-[#FFCA26]"
        />
        <select
          value={filterMember}
          onChange={handleFilterChange}
          className="w-full p-2 text-xs rounded-lg border border-[#EBE6DA] bg-white focus:outline-none focus:ring-1 focus:ring-[#FFCA26]"
        >
          <option value="All">All Members (ทุกคน)</option>
          {memberOptions}
        </select>
      </div>
    </div>
  );


export default MembersFilter;
    