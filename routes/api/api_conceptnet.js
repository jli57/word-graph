const express = require("express");
const router = express.Router();
const fetchRelated = require("./api_util.js");
var request = require('request');

router.get('/', (req, res) => {

  const options = { word: "example", limit: 20, offset: 0 };
  const { word, limit, offset } = options;
  const url = `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=${limit+offset}`;

  request( url, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log(body);
    res.send( body );
    // console.log( fetchRelated( options, JSON.parse(body)) );
  });

});

module.exports = router;