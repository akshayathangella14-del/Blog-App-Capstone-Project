import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  loadingClass,
  errorClass,
  emptyStateClass,
  inputClass,
  deleteBtn,
  cardClass,
  mutedText,
  avatar,
  tagClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleMeta,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function AdminProfile() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);

  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // Switch between 'users' and 'articles'

  // ─── FETCH DATA ───────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // According to your .http files, admin reads users from /admin-api/users
        // We assume articles are available at /admin-api/articles or /user-api/articles
        const [userRes, articleRes] = await Promise.all([
          axios.get("http://localhost:4000/admin-api/users", { withCredentials: true }),
          axios.get("http://localhost:4000/user-api/articles", { withCredentials: true })
        ]);

        if (userRes.status === 200) setUsers(userRes.data.payload || []);
        if (articleRes.status === 200) setArticles(articleRes.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load system data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── USER ACTIONS ─────────────────────────────────────
  const toggleUserStatus = async (user) => {
    try {
      const res = await axios.patch(
        "http://localhost:4000/admin-api/user-status",
        { userId: user._id, isUserActive: !user.isUserActive },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data.payload : u)));
        toast.success(user.isUserActive ? "User Blocked" : "User Restored");
      }
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // ─── ARTICLE ACTIONS ──────────────────────────────────
  const toggleArticleStatus = async (article) => {
    try {
      const res = await axios.patch(
        "http://localhost:4000/admin-api/article-status",
        {
          articleId: article._id,
          isArticleActive: !article.isArticleActive,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setArticles((prev) =>
          prev.map((a) =>
            a._id === article._id ? res.data.payload : a
          )
        );

        toast.success(
          article.isArticleActive
            ? "Article Disabled"
            : "Article Enabled"
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update article status");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
    toast.success("Signed out");
  };

  // ─── FILTERING ────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={pageWrapper}>
      {/* ADMIN HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`${avatar} w-14 h-14 text-lg`}>
            {currentUser?.firstName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={mutedText}>System Administrator</p>
            <h2 className="text-xl font-bold text-[#1d1d1f]">{currentUser?.firstName}</h2>
          </div>
        </div>
        <button className={deleteBtn} onClick={onLogout}>Logout</button>
      </div>

      <div className="mb-8">
        <h1 className={pageTitleClass}>
          Admin Dashboard
        </h1>
        {/* TAB SWITCHER */}
        <div className="flex gap-8 mt-6 border-b border-[#e8e8ed]">
          <button
            onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
            className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'users' ? 'text-[#0066cc] border-b-2 border-[#0066cc]' : 'text-[#a1a1a6]'}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => { setActiveTab("articles"); setSearchTerm(""); }}
            className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'articles' ? 'text-[#0066cc] border-b-2 border-[#0066cc]' : 'text-[#a1a1a6]'}`}
          >
            Articles ({articles.length})
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-8">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          className={inputClass}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className={loadingClass}>Fetching system data...</p>}
      {error && <p className={errorClass}>{error}</p>}

      {/* USERS TABLE */}
      {activeTab === "users" && !loading && (
        <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#f5f5f7] border-b border-[#e8e8ed]">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6e6e73] uppercase tracking-widest">Identity</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6e6e73] uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6e6e73] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6e6e73] uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed]">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#f5f5f7]/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-[#1d1d1f]">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-[#a1a1a6]">{user.email}</p>
                  </td>
                  <td className="px-6 py-4"><span className={tagClass}>{user.role}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isUserActive ? 'bg-[#34c759]' : 'bg-[#ff3b30]'}`} />
                      <span className="text-xs font-medium">{user.isUserActive ? "Active" : "Blocked"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`text-xs font-bold ${user.isUserActive ? 'text-[#ff3b30]' : 'text-[#34c759]'} hover:underline`}
                    >
                      {user.isUserActive ? "Block Access" : "Unblock Access"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ARTICLES GRID */}
      {activeTab === "articles" && !loading && (
        <div className={articleGrid}>
          {filteredArticles.map((article) => (
            <div key={article._id} className={articleCardClass}>

              <div className="flex justify-between items-start">
                <span className={tagClass}>{article.category}</span>

                {article.isArticleActive ? (
                  <span className="text-[10px] font-bold text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#ff3b30] bg-[#ff3b30]/10 px-2 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </div>

              <h3 className={`${articleTitle} mt-2`}>
                {article.title}
              </h3>

              <p className={articleMeta}>
                ID: {article._id}
              </p>

              {/* AUTHOR NAME */}
              <p className="text-xs text-[#6e6e73] mt-2">
                By{" "}
                {article.authorData?.firstName ||
                  article.author?.firstName ||
                  "Unknown"}
              </p>

              {/* ONLY REVIEW BUTTON */}
              <div className="mt-4 pt-4 border-t border-[#e8e8ed] flex justify-start">
                <button
                  onClick={() =>
                    navigate(`/article/${article._id}`, {
                      state: article,
                    })
                  }
                  className="text-xs font-semibold text-[#0066cc] hover:underline"
                >
                  Review
                </button>
              </div>

            </div>
          ))}

          {filteredArticles.length === 0 && (
            <p className={emptyStateClass}>No articles found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProfile;