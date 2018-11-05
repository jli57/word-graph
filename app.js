const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiConceptNet = require("./routes/api/api_conceptnet.js");
const path = require("path");
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'frontend','dist')));


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/dist'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  })
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/dist/index.html'));
});

app.use("/api/conceptnet", apiConceptNet);

app.listen(port, () => {
  // console.log(`Server is running on port ${port}`)
});
