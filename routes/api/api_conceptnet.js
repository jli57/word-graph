const express = require("express");
const router = express.Router();
const fetchRelated = require("./api_util.js");
var request = require('request');

router.post('/', (req, res) => {

  const { word, limit, offset } = req.body;

  const url = `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=${limit+offset}`;

  request( url, (error, response, body) => {
    // console.log('error:', error); // Print the error if one occurred and handle it
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    res.send( body );
  });
});

module.exports = router;