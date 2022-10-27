const express = require("express");
const app = express();
const db = require("./config/database");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/file");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
db.sync({ force: false }).then();
app.use(userRoutes);
app.use(fileRoutes);
app.listen(3000, () => {
  console.log("Web application is running at port: 3000!");
});
