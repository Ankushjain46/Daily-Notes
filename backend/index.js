const db = require("./db.js");
const express = require("express");
const connectToMongo = require("./db.js");
var cors = require("cors");

connectToMongo();
const app = express();

app.use(cors());
const port = 5000;

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`DailyNotes listening at http://localhost:${port}`);
});
