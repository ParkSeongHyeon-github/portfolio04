import express from "express";
import path from "path";
import jsonServer from "json-server";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(cors());

app.use(middlewares);

app.use("/api", router);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});