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

app.get("/covid", cors(), async function (req, res) {
  let userId = req.query.userId;

  console.log("It's in covid index.js!!!userID------>", userId)
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

app.get("/joke", cors(), async function (req, res) {
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
      // process.env.USER_ID_Y,
      // // process.env.USER_ID_S,
      // process.env.USER_ID_K,
      // process.env.USER_ID_A,
      // // process.env.USER_ID_R,
      userId
    ],
    [
      {
        type: "text",
        text: `${userId}, check this out: ${joke}`,
      },
    ]
  );
  res.json("success");
});

app.get("/fortune", cors(), async function(req, res) {
  let userId = req.query.userId;
  const day = "today";
  const sign = "virgo";
  const URL = `https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`;
  let data = {};
  
  await axios
    .post(URL).then((response) => { data = response.data } )
    .catch((err) => {
      console.error(err);
    });

  const curDate = data.current_date;
  const compatibility = data.compatibility;
  const luckyNum = data.lucky_number;
  const luckyTime = data.lucky_time;
  const colour = data.color;
  const mood = data.mood;
  const description = data.description;

  let fortune = `Your fortune for ${curDate} is as follows: Your lucky number is ${luckyNum}, lucky time is ${luckyTime} and lucky colour is ${colour}. ${description} and don't forget to be ${mood}.`


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
        text: fortune,
      },
    ]
  );
});

app.get("/send-messages", cors(), function (req, res) {
  let userId = req.query.userId;
  console.log("IS IT SENDING MESSAGES???", userId);
  client.multicast(
    [
      userId
    ],
    [
      {
        type: "text",
        text: `Good morning, ${userId}!!!`,
      },
    ]
  );
  res.json("success");
});

app.get("/news", cors(), async function (req, res) {
  let news = "";
  let userId = req.query.userId;

  var url = 'http://newsapi.org/v2/top-headlines?' +
          'sources=bbc-news&' +
          'apiKey=ba6018a0c29b4508be8a24c16e933a85';

  await axios
    .get(url)
    .then((res) => {
      console.log(res.data)
      return res.data;
    })
    .then((response) => {
      console.log("index.js LINE 190 await axios 2nd THEN *****", response);
    })
    .catch((err) => {
      console.error(err);
    });

  // client.multicast(
  //   [
  //     // process.env.USER_ID_Y,
  //     // // process.env.USER_ID_S,
  //     // process.env.USER_ID_K,
  //     // process.env.USER_ID_A,
  //     // // process.env.USER_ID_R,
  //     userId
  //   ],
  //   [
  //     {
  //       type: "text",
  //       text: `${userId}, check this out: ${joke}`,
  //     },
  //   ]
  // );
  res.json("success");
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
