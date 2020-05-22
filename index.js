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

  //console.log("It's in covid index.js!!!userID------>", userId);
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
      console.error(err);
    });

  client.multicast(
    [userId],
    [
      {
        type: "text",
        text: covidReport,
      },
    ]
  );
});

app.get("/send-id", function (req, res) {
  //console.log("index.js LINE 67 ***********");
  res.json({ id: myLiffId });
});

app.get("/joke", cors(), async function (req, res) {
  let joke = "";

  let userId = req.query.userId;

  //console.log("index.js line76 **** receiving userid", req);

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
      //console.log("index.js LINE 90 await axios 2nd THEN *****", response);
      const setup = response.setup;
      const punchline = response.punchline;
      joke = `${setup}...🤣${punchline}`;
    })
    .catch((err) => {
      console.log(err);
    });

  client.multicast(
    [userId],
    [
      {
        type: "text",
        text: `Joke of the day😁 ${joke}`,
      },
    ]
  );
  res.json("success");
});

app.get("/fortune", cors(), async function (req, res) {
  let userId = req.query.userId;
  const day = "today";
  const sign = "virgo";
  const URL = `https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`;
  let data = {};

  await axios
    .post(URL)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      console.error(err);
    });

  const curDate = data.current_date;
  //const compatibility = data.compatibility;
  const luckyNum = data.lucky_number;
  const luckyTime = data.lucky_time;
  const colour = data.color;
  const mood = data.mood;
  const description = data.description;

  let fortune = `Your fortune for ${curDate} is as follows: Your lucky number is 🎲${luckyNum}, lucky time is ⌚${luckyTime} and lucky colour is 🌈${colour}.
    ${description} and don't forget to be ${mood}.`;

  client.multicast(
    [userId],
    [
      {
        type: "text",
        text: fortune,
      },
    ]
  );
});

// FOR TESTING
app.get("/send-messages", cors(), function (req, res) {
  let userId = req.query.userId;
  console.log("IS IT SENDING MESSAGES???", userId);
  client.push(userId, [
    {
      type: "text",
      text: `🌞Good morning!!!`,
    },
  ]);
  res.json("success");
});

app.get("/weather", cors(), async function (req, res) {
  let userId = req.query.userId;

  let weatherReport, location, dailySum, hourlySum;

  await axios
    .get("https://dark-sky.p.rapidapi.com/35.69,139.69", {
      query: {
        lang: "en",
        units: "auto",
        exclude: "minutely%2C alerts%2C flags",
      },
      headers: {
        "x-rapidapi-host": "dark-sky.p.rapidapi.com",
        "x-rapidapi-key": "c0845f3ebamshedce55a635e2681p1ab8aejsn296c2925b9de",
      },
    })
    .then((response) => {
      location = response.data.timezone;
      dailySum = response.data.daily.summary;
      hourlySum = response.data.hourly.summary.toLowerCase();
    })
    .catch((err) => {
      console.error(err);
    });

  weatherReport = `Today's weather for Tokyo: ${dailySum} Then later ${hourlySum}`;

  client.multicast(
    [userId],
    [
      {
        type: "text",
        text: weatherReport,
      },
    ]
  );
});

app.get("/news", cors(), async function (req, res) {
  let userId = req.query.userId;

  var url =
    "http://newsapi.org/v2/top-headlines?" +
    "sources=bbc-news&" +
    "apiKey=ba6018a0c29b4508be8a24c16e933a85";

  let title1,
    description1,
    url1,
    title2,
    description2,
    url2,
    title3,
    description3,
    url3;

  function luckyNumber() {
    let min = Math.ceil(0);
    let max = Math.floor(9);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  let lucky1 = luckyNumber();
  let lucky2 = luckyNumber();
  let lucky3 = luckyNumber();

  await axios
    .get(url)
    .then((res) => {
      return res.data;
    })
    .then((response) => {
      title1 = response.articles[lucky1].title;
      description1 = response.articles[lucky1].description;
      url1 = response.articles[lucky1].url;
      title2 = response.articles[lucky2].title;
      description2 = response.articles[lucky2].description;
      url2 = response.articles[lucky2].url;
      title3 = response.articles[lucky3].title;
      description3 = response.articles[lucky3].description;
      url3 = response.articles[lucky3].url;
    })
    .catch((err) => {
      console.error(err);
    });

  let news = `${title1}
    ${description1}
    ${url1}
    
    ${title2}
    ${description2}
    ${url2}
  
    ${title3}
    ${description3}
    ${url3}
    `;

  client.multicast(
    [userId],
    [
      {
        type: "text",
        text: news,
      },
    ]
  );
  res.json("success");
});

//app.listen(port, () => console.log(`app listening on port ${port}!`));
app.listen(port, () => {
  console.log(
    `Starting Express server . . . . . . . . . . . \x1b[32m✔ SUCCESS!\x1b[0m`
  );
  console.log(`█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█`);
  // eslint-disable-next-line prettier/prettier
  console.log(
    `█       \x1b[36mExpress Server is listening on port\x1b[0m ${port}        █`
  );
  console.log(`█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█`);
});
