const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;
const cors = require("cors");
const myLiffId = process.env.MY_LIFF_ID;
const { LineClient } = require("messaging-api-line");
const axios = require("axios");
const ip = require("ip");
// app.set("trust proxy", true);

app.use(express.static("./frontend/build"));

const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

app.get("/get-ip-address", function (req, res) {
  console.log(ip.address());
});

app.get("/send-id", function (req, res) {
  res.json({ id: myLiffId });
});

app.get("/send-joke", cors(), async function (req, res) {
  let joke = "";

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
      console.log("dad joke ***********-->", response);
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
      process.env.USER_ID_S,
      process.env.USER_ID_K,
      process.env.USER_ID_A,
      process.env.USER_ID_R,
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

app.listen(port, () => console.log(`app listening on port ${port}!`));
