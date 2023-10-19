require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const apiKey = process.env["API_KEY"];
let requesterIpDetails;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app
  .route("/")
  .get(function (req, res) {
    const url = "https://geo.ipify.org/api/v2/country,city?apiKey=" + apiKey;

    https.get(url, function (response) {
      response.on("data", function (data) {
        requesterIpDetails = JSON.parse(data);
        res.render("index", { result: requesterIpDetails });
      });
    });
  })

  .post(function (req, res) {
    const ipAddress = req.body.address;
    const url =
      "https://geo.ipify.org/api/v2/country,city?apiKey=" +
      apiKey +
      "&ipAddress=" +
      ipAddress;

    https.get(url, function (response, err) {
      if (response.statusCode === 200) {
        response.on("data", function (data) {
          const searchedIpDetails = JSON.parse(data);
          res.render("index", { result: searchedIpDetails });
        });
      } else {
        requesterIpDetails["badrequest"] = true;
        res.render("index", { result: requesterIpDetails });
      }
    });
  });

// export default requesterIpDetails;

app.listen("3000", function () {
  console.log("server is running on port 3000+");
});
