import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { verifyToken } from "../middlewares/VerifyToken.js"
export const authorApp = exp.Router()

//Write article
authorApp.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
    const articleObj = req.body;
    const user = req.user;
    let author = await UserModel.findById(articleObj.author);

    if (!author) {
        return res.status(404).json({ message: "Invalid author" });
    }
    if (author.email !== user.email) {
        return res.status(403).json({ message: "You are not authorised" });
    }

    // Save article to DB
    const newArticle = new ArticleModel(articleObj);
    await newArticle.save();
    res.status(201).json({ message: "Article created successfully", payload: newArticle });
});

//Read own articles
authorApp.get("/articles", verifyToken("AUTHOR"), async (req, res) => {
    //get author id from decoded token
    const authorIdOfToken = req.user?.id
    const articlesList = await ArticleModel.find({
        author: authorIdOfToken
    }).populate(
        "author",
        "firstName lastName profileImageUrl"
    );

    res.status(200).json({
        message: "Articles fetched successfully",
        payload: articlesList
    });
})

//Edit articles
authorApp.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
    //get author id from decoded token
    const authorIdOfToken = req.user?.id
    //get modified article from client
    const { articleId, title, category, content } = req.body
    const modifiedArticle = await ArticleModel.findOneAndUpdate(
        { _id: articleId, author: authorIdOfToken },
        { $set: { title, category, content } },
        { new: true }
    )
    if (!modifiedArticle) {
        return res.status(403).json({ message: "Not authorised to edit the article" })
    }
    //send res
    res.status(200).json({ message: "Article modified successfully", payload: modifiedArticle })

})

//Delete articles(soft delete)
authorApp.patch("/articles", verifyToken("AUTHOR"), async (req, res) => {
    const authorIdOfToken = req.user?.id;
    const { articleId, isArticleActive } = req.body;

    const articleOfDB = await ArticleModel.findOne({ _id: articleId, author: authorIdOfToken });

    if (!articleOfDB) {
        return res.status(404).json({ message: "Article not found" });
    }
    // Update the status
    articleOfDB.isArticleActive = isArticleActive;
    await articleOfDB.save();

    res.status(200).json({
        message: `Article ${isArticleActive ? 'restored' : 'deleted'} successfully`,
        payload: articleOfDB
    });
});