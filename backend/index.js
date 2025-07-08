const express = require("express");
const cors = require("cors");
const recommendRoute = require("./routes/recommend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/", recommendRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
