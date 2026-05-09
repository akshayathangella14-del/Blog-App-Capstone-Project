import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import banner from "../assets/banner.png";
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  tagClass,
  loadingClass,
  emptyStateClass,
} from "../styles/common";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://blog-app-capstone-project-fliv.onrender.com/user-api/articles",
        { withCredentials: true }
      );

      setArticles(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className={loadingClass}>
        Loading beautiful articles...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#e8e8ed]">
        <div
          className={`${pageWrapper} py-20 flex flex-col lg:flex-row items-center justify-between gap-14`}
        >

          {/* LEFT CONTENT */}
          <div className="max-w-3xl flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0066cc] mb-4">
              Modern Publishing Platform
            </p>

            <h1 className={`${pageTitleClass} leading-tight`}>
              Discover stories,
              <br />
              thinking & ideas.
            </h1>

            <p className={`${bodyText} mt-6 text-lg max-w-2xl`}>
              A clean and modern platform where developers,
              writers and creators share knowledge, ideas
              and inspiration with the world.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              {/* Explore Articles */}
              <button
                className="bg-[#0066cc] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#004499] transition-all"
                onClick={() => navigate("/articles")}
              >
                Explore Articles
              </button>

              {/* Become a Writer */}
              <button
                className="border border-[#d2d2d7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#f5f5f7] transition-all"
                onClick={() => navigate("/register")}
              >
                Become a Writer
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src={banner}
              alt="banner"
              className="w-full max-w-md object-contain"
            />
          </div>

        </div>
      </section>

      {/* ARTICLES */}
      <section className={pageWrapper}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Latest Articles
            </h2>

            <p className="text-[#6e6e73] mt-2">
              Fresh thoughts and technical insights from our writers.
            </p>
          </div>

          <p className="text-sm text-[#a1a1a6]">
            {articles.length} Articles
          </p>
        </div>

        {articles.length === 0 ? (
          <div className={emptyStateClass}>
            No articles published yet.
          </div>
        ) : (
          <div className={articleGrid}>
            {articles.map((article) => (
              <div
                key={article._id}
                onClick={() => navigate(`/article/${article._id}`)}
                className={`${articleCardClass} rounded-3xl border border-[#ececf1] hover:scale-[1.02] hover:shadow-sm duration-300`}
              >
                {/* CATEGORY */}
                <span className={tagClass}>
                  {article.category}
                </span>

                {/* TITLE */}
                <h2 className={`${articleTitle} text-xl mt-2`}>
                  {article.title}
                </h2>

                {/* CONTENT */}
                <p className={`${articleExcerpt} line-clamp-3 mt-2`}>
                  {article.content}
                </p>

                {/* FOOTER */}
                <div className="mt-6 pt-5 border-t border-[#e8e8ed] flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {/* PROFILE IMAGE OR FALLBACK */}
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

                  <p className={articleMeta}>
                    Read →
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;