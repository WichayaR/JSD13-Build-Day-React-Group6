# Contributions

| Member (GitHub username) | Component(s) built | Uses shared state? | Integrated into |
|---|---|---|---|
| @Charnon | AddTaskForm.jsx | Yes (adds tasks to `tasks` state) | App.jsx |
| @Focus | MemberFilter.jsx | Yes (reads `searchQuery` and `filterMember` shared state) | App.jsx |
| @Heinz | ProjectProgress.jsx | Yes (reads `tasks` shared state) | App.jsx |
| @Tony | RoleColumn.jsx | Yes (reads `tasks`, calls `onDelete`, `onStatusChange`) | App.jsx |
| @Touch | TaskItem.jsx | Yes (calls `onDelete`, `onStatusChange` to update shared `tasks`) | RoleColumn.jsx |