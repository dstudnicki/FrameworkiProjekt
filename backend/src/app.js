require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db_config");
const authRoutes = require("./routes/auth");
const protectedRoute = require("./routes/protectedRoute");
const postsRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/protected", protectedRoute);
app.use("/posts", postsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
