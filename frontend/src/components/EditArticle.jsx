import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Redirect if no article found
  useEffect(() => {
    if (!article) {
      navigate("/author-profile/articles");
      return;
    }

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article, setValue, navigate]);

  const updateArticle = async (modifiedArticle) => {
    try {
      setLoading(true);

      modifiedArticle.articleId = id;

      const res = await axios.put(
        "http://localhost:4000/author-api/articles",
        modifiedArticle,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Article updated successfully");

        navigate(`/article/${id}`, {
          state: res.data.payload,
        });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input
            className={inputClass}
            {...register("title", {
              required: "Title required",
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

           <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>

            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="cybersecurity">Cyber Security</option>
            <option value="cloud-computing">Cloud Computing</option>
            <option value="data-science">Data Science</option>
            <option value="machine-learning">Machine Learning</option>
            <option value="devops">DevOps</option>
            <option value="software-engineering">Software Engineering</option>
            <option value="ui-ux-design">UI/UX Design</option>
            <option value="blockchain">Blockchain</option>
            <option value="career-guidance">Career Guidance</option>
            <option value="productivity">Productivity</option>
            <option value="startup">Startup</option>
            <option value="open-source">Open Source</option>
            <option value="tutorials">Tutorials</option>
            <option value="coding-interview">Coding Interview</option>
            <option value="college-life">College Life</option>
            <option value="project-showcase">Project Showcase</option>
            <option value="freelancing">Freelancing</option>
            <option value="tech-news">Tech News</option>
          </select>

          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea
            rows="14"
            className={inputClass}
            {...register("content", {
              required: "Content required",
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          className={submitBtn}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Article"}
        </button>

        {loading && (
          <p className={loadingClass}>
            Updating article...
          </p>
        )}
      </form>
    </div>
  );
}

export default EditArticle;