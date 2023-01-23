const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const mealsRoutes = require("./routes/mealRoutes");

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);
app.use("/api/user", mealsRoutes);

app.listen(PORT, () => {
  console.log("server listening on port");
  connectDB();
});
