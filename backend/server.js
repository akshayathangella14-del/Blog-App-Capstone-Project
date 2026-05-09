import exp from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import { userApp } from "./APIs/UserAPI.js"
import { authorApp } from "./APIs/AuthorAPI.js"
import { adminApp } from "./APIs/AdminAPI.js"
import { commonApp } from "./APIs/CommonAPI.js"
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()
const app = exp()
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://blog-app-capstone-project.vercel.app' // This is your actual Frontend!
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

//body parser middleware
app.use(exp.json())

//cookie parser middleware
app.use(cookieParser())

//path level middlewares
app.use("/user-api",userApp)
app.use("/author-api",authorApp)
app.use("/admin-api",adminApp)
app.use("/auth",commonApp)
//assign port
const port = process.env.PORT || 5000


//connect to db
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB connected")
        //assign port
        const port = process.env.PORT || 5000
        app.listen(port, () => console.log(`server listening on ${port}..`))
    } catch (err) {
        console.log("Error in DB connect", err)
    }
}
connectDB()

//to handle invalid path
app.use((req, res, next) => {
    console.log(req.url)
    res.status(404).json({ message: `path ${req.url} is invalid` })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", err); 

  // ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }

  // CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`, 
    });
  }

  // send server side error
 res.status(500).json({ message: "error occurred", error: err.message });
});
