import express from "express";
import notesRouter from "./routes/notes.router.js";
import authRouter from "./routes/auth.router.js";
import {requireAuth} from "./middlewares/requireAuth.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(cookieParser())
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/notes",requireAuth, notesRouter)
app.use("/api/v1/auth", authRouter)

export default app;
