import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();
  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FETCH ARTICLE
  useEffect(() => {
    const getArticleById = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/user-api/article/${id}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setArticle(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading article");
      } finally {
        setLoading(false);
      }
    };
    if (!location.state) getArticleById();
  }, [id, location.state]);

  //FORMAT DATE (With Guard)
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return "Date unavailable";
    }

    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ DELETE / RESTORE
  const toggleArticleStatus = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:4000/author-api/articles",
        { articleId: article._id, isArticleActive: !article.isArticleActive },
        { withCredentials: true }
      );
      if (res.status === 200) setArticle(res.data.payload);
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const editArticle = () => {
    navigate(`/edit-article/${article._id}`, { state: article });
  };

  // ✅ ADD COMMENT
  const addComment = async (commentObj) => {
    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        { articleId: article._id, comment: commentObj.comment },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setArticle(res.data.payload);
        reset();
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  if (!article.isArticleActive && user?.role !== "AUTHOR") {
    return <p className={errorClass}>This article is not available</p>;
  }

  return (
    <div className={articlePageWrapper}>
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">← Back</button>

      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>
        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            {article.authorData?.firstName || article.author?.firstName || "Author"}
          </div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      <div className={articleContent}>{article.content}</div>

      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={editArticle}>Edit</button>
          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {user?.role === "USER" && (
        <div className="mt-8 border-t pt-6">
          <form onSubmit={handleSubmit(addComment)} className="flex flex-col gap-3">
            <textarea
              {...register("comment", { required: true })}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Write your comment..."
            />
            <button type="submit" className={`${editBtn} w-fit`}>Add Comment</button>
          </form>
        </div>
      )}

      {/* COMMENTS SECTION */}
      <div className={commentsWrapper}>
        <h3 className="text-lg font-bold mb-4">Discussion ({article.comments?.length || 0})</h3>

        {article.comments?.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No comments yet</p>
        ) : (
          [...article.comments].reverse().map((commentObj, index) => {
            const name = commentObj.user?.firstName
              ? `${commentObj.user.firstName} ${commentObj.user.lastName || ""}`
              : "User";

            return (
              <div key={index} className={commentCard}>
                <div className={commentHeader}>
                  <div className={commentUserRow}>
                    {commentObj.user?.profileImageUrl ? (
                      <img src={commentObj.user.profileImageUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                    ) : (
                      <div className={avatar}>{name.charAt(0).toUpperCase()}</div>
                    )}
                    <div>
                      <p className={commentUser}>{name}</p>
                      <p className={commentTime}>
                        {formatDate(commentObj.createdAt || commentObj.date)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={commentText}>{commentObj.comment}</p>
              </div>
            );
          })
        )}
      </div>

      <div className={articleFooter}>
        Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;