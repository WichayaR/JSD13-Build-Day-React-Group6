function MembersFilter({ members, searchQuery, onSearchChange, filterMember, onFilterChange }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
      <h2 className="text-lg font-bold text-green-900 mb-3">Search & Filter</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        className="w-full mb-2 p-2 rounded-lg border border-stone-200"
      />
      <select
        value={filterMember}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-stone-200"
      >
        <option value="All">All Members</option>
        {members.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  )
}

export default MembersFilter
