const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;
const cors = require("cors");
const myLiffId = process.env.MY_LIFF_ID;
const { LineClient } = require("messaging-api-line");
const axios = require("axios");

app.use(express.static("build"));

const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

app.get("/get-covid-status", cors(), async function (req, res) {
  let userId = req.query.userId;

  console.log("It's in covid index.js!!!", userId)
  let covidReport;
  await axios
    .get("https://covid-193.p.rapidapi.com/statistics?country=Japan", {
      headers: {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": "1c306d3386mshb1967e7c5f086f6p18a930jsncd5654c429dc",
      },
    })
    .then((response) => {
      let activeCases = response.data.response[0].cases.active || 0;
      let newCases = response.data.response[0].cases.new || 0;
      let newDeaths = response.data.response[0].deaths.new || 0;
      covidReport = `DAILY COVID REPORT: There are ${activeCases} active cases, ${newCases} new cases, and ${newDeaths} new deaths.`;
    })
    .catch((err) => {
      console.log(err);
    });

  client.multicast(
    [
      // process.env.USER_ID_Y,
      // process.env.USER_ID_S,
      // process.env.USER_ID_K,
      // process.env.USER_ID_A,
      // process.env.USER_ID_R,
      userId
    ],
    [
      {
        type: "text",
        text: userId ,
      },
      {
        type: "text",
        text: covidReport,
      },
    ]
  );
});

app.get("/send-id", function (req, res) {
  console.log("index.js LINE 67 ***********");
  res.json({ id: myLiffId });
});

app.get("/send-joke", cors(), async function (req, res) {
  let joke = "";

  let userId = req.query.userId;

  console.log("index.js line76 **** receiving userid", req)

  await axios
    .get("https://dad-jokes.p.rapidapi.com/random/jokes", {
      // method: "GET",
      headers: {
        "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
        "x-rapidapi-key": "1c306d3386mshb1967e7c5f086f6p18a930jsncd5654c429dc",
      },
    })
    .then((res) => {
      return res.data;
    })
    .then((response) => {
      console.log("index.js LINE 90 await axios 2nd THEN *****", response);
      const setup = response.setup;
      const punchline = response.punchline;
      joke = `${setup}...${punchline}`;
    })
    .catch((err) => {
      console.log(err);
    });

  client.multicast(
    [
      process.env.USER_ID_Y,
      // process.env.USER_ID_S,
      process.env.USER_ID_K,
      process.env.USER_ID_A,
      // process.env.USER_ID_R,
      // userId
    ],
    [
      {
        type: "text",
        text: joke,
      },
    ]
  );
  res.json("success");
});

app.get("/send-messages", cors(), function (req, res) {
  console.log("IS IT SENDING MESSAGES???");
  client.multicast(
    [
      process.env.USER_ID_Y,
      process.env.USER_ID_S,
      process.env.USER_ID_K,
      process.env.USER_ID_A,
      process.env.USER_ID_R,
    ],
    [
      {
        type: "text",
        text: "You have final warning....",
      },
    ]
  );
  res.json("success");
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
