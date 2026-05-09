import {
  pageTitleClass,
  cardClass,
  loadingClass,
  errorClass,
  emptyStateClass,
  headingClass,
  bodyText,
  mutedText,
} from "../styles/common";

import { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://blog-app-capstone-project-fliv.onrender.com/admin-api/users",
        { withCredentials: true }
      );
      setUsers(res.data.payload || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      const res = await axios.patch(
        "https://blog-app-capstone-project-fliv.onrender.com/admin-api/user-status",
        {
          userId: user._id,
          isUserActive: !user.isUserActive,
        },
        { withCredentials: true }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? res.data.payload : u))
      );
    } catch {
      setError("Failed to update user");
    }
  };

  if (loading) return <div className={loadingClass}>Loading users...</div>;
  if (error) return <div className={errorClass}>{error}</div>;
  if (users.length === 0)
    return <div className={emptyStateClass}>No users found</div>;
return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-10">
        <h1 className={pageTitleClass}>Users</h1>
        <p className="text-gray-500 text-sm">Manage your community members and their access levels.</p>
      </div>

      {/* GRID - Changed to 1 column on small, 2 on large to give cards more width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            
            <div className="flex items-center gap-5">
              {/* AVATAR - Fixed size, no shrinking */}
              <div className="relative shrink-0">
                <img
                  src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}&background=6366f1&color=fff`}
                  alt="user"
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                />
              </div>

              {/* USER INFO - Flex grow to take space, truncate handling */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500 truncate mb-1">{user.email}</p>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
            </div>

            {/* ACTIONS ROW - Better spacing and alignment */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${user.isUserActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${user.isUserActive ? "text-green-600" : "text-red-500"}`}>
                  {user.isUserActive ? "Active" : "Blocked"}
                </span>
              </div>
              
              <button
                onClick={() => toggleStatus(user)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  user.isUserActive
                    ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                    : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"
                }`}
              >
                {user.isUserActive ? "Block User" : "Unblock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;