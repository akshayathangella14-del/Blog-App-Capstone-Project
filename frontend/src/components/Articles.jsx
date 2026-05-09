import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  tagClass,
} from "../styles/common";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "http://localhost:4000/user-api/articles",
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setArticles(res.data.payload || []);
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
          "Unable to load articles at this time."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // FORMAT DATE SAFELY
  const formatDate = (date) => {
    if (!date) return "Recently";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Recently";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={pageWrapper}>

      {/* HEADER */}
      <header className="mb-12">
        <h1 className={pageTitleClass}>Articles</h1>

        <p className={`${bodyText} mt-2 text-lg`}>
          Explore the latest insights, tutorials,
          and stories from our community.
        </p>
      </header>

      {/* LOADING */}
      {loading && (
        <p className={loadingClass}>
          Fetching latest articles...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className={errorClass}>
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading && articles.length === 0 && !error && (
        <p className={emptyStateClass}>
          No articles have been published yet.
        </p>
      )}

      {/* ARTICLES GRID */}
      {!loading && articles.length > 0 && (
        <div className={articleGrid}>

          {articles.map((article) => (

            <div
              key={article._id}
              className={`${articleCardClass} cursor-pointer`}
              onClick={() =>
                navigate(`/article/${article._id}`, {
                  state: article,
                })
              }
            >

              {/* CATEGORY */}
              <div className="flex justify-between items-start mb-2">
                <span className={tagClass}>
                  {article.category || "General"}
                </span>
              </div>

              {/* TITLE */}
              <h2 className={articleTitle}>
                {article.title}
              </h2>

              {/* CONTENT */}
              <p className={`${articleExcerpt} line-clamp-3`}>
                {article.content}
              </p>

              {/* FOOTER */}
              <div className="mt-auto pt-4 flex items-center justify-between">

                {/* AUTHOR */}
                <div className="flex items-center gap-3">

                  {/* PROFILE IMAGE / FALLBACK */}
                  {article.author?.profileImageUrl ? (
                    <img
                      src={article.author.profileImageUrl}
                      alt="author"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-sm font-semibold">
                      {
                        (
                          article.author?.firstName?.charAt(0) ||
                          article.author?.firstName?.charAt(0) ||
                          "A"
                        ).toUpperCase()
                      }
                    </div>
                  )}

                  {/* AUTHOR NAME */}
                  <div>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {
                        article.author?.firstName ||
                        article.author?.firstName ||
                        "Anonymous"
                      }
                    </p>

                    <p className={articleMeta}>
                      Author
                    </p>
                  </div>
                </div>

                {/* DATE */}
                <p className={articleMeta}>
                  {formatDate(
                    article.dateOfModification ||
                    article.updatedAt ||
                    article.createdAt
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;