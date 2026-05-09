import exp from 'express';
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from '../models/ArticleModel.js';

export const userApp = exp.Router();


// READ ALL ACTIVE ARTICLES
userApp.get("/articles", async (req, res) => {
    try {
        const articlesList = await ArticleModel.find({
            isArticleActive: true
        })
            .populate("author", "firstName lastName profileImageUrl");

        res.status(200).json({
            message: "Articles fetched successfully",
            payload: articlesList
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching articles",
            error: err.message
        });
    }
});


// ADD COMMENT TO ARTICLE
userApp.put("/articles", verifyToken("USER"), async (req, res) => {
    try {
        const { articleId, comment } = req.body;

        const articleDocument = await ArticleModel.findOne({
            _id: articleId,
            isArticleActive: true
        });

        if (!articleDocument) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        const userId = req.user?.id;

        articleDocument.comments.push({
            user: userId,
            comment: comment,
            createdAt: new Date()
        });
        await articleDocument.save();

        const updatedArticle = await ArticleModel.findById(articleId)
            .populate("author", "firstName lastName profileImageUrl")
            .populate("comments.user", "firstName lastName profileImageUrl");

        res.status(200).json({
            message: "Comment added successfully",
            payload: updatedArticle
        });

    } catch (err) {
        res.status(500).json({
            message: "Error adding comment",
            error: err.message
        });
    }
});


// GET SINGLE ARTICLE BY ID
userApp.get("/article/:id", verifyToken("USER", "AUTHOR"), async (req, res) => {
    try {
        const articleId = req.params.id;

        const article = await ArticleModel.findById(articleId)
            .populate("author", "firstName lastName profileImageUrl")
            .populate("comments.user", "firstName lastName profileImageUrl");

        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.status(200).json({
            message: "Article found",
            payload: article
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching article",
            error: err.message
        });
    }
});