const { LineClient } = require("messaging-api-line");
require("dotenv").config();

// get accessToken and channelSecret from LINE developers website
const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

// client
//   .push("", [{ type: "text", text: "Hello!" }])
//   .catch((err) => console.log(err));

client.multicast(
  [process.env.USER_ID_Y, process.env.USER_ID_S, process.env.USER_ID_K, process.env.USER_ID_A, process.env.USER_ID_R],
  [
    {
      type: 'text',
      text: 'You have the final warning.',
    },
  ]
);