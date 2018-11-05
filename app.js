const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiConceptNet = require("./routes/api/api_conceptnet.js");

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/conceptnet", apiConceptNet);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
