import express from "express"
import cors from "cors"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))



//routes import
import categoryRouter from "./routes/category.routes.js";
import subCategoryRouter from "./routes/subCategory.routes.js";
import itemRouter from "./routes/items.routes.js";


// routes declaration
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/items", itemRouter)


export { app }


