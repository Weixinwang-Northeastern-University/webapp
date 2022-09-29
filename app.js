const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Sever is running on port 3000");
});
