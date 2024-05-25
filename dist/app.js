import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();
const allowedOrigins = [
    'https://ai-chat-bot-front-jt804p9g7-atul-kumar-pandeys-projects.vercel.app',
    'https://ai-chat-bot-front-end.vercel.app',
    'https://ai-chat-bot-front-jt804p9g7-atul-kumar-pandeys-projects.vercel.app',
    '*'
];
app.get("/", (req, res) => {
    return res.send("Hello World.");
});
app.use(cors({
    origin: function (origin, callback) {
        // Check if the request origin is in the allowed origins list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// remove it in production
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
export default app;
//# sourceMappingURL=app.js.map