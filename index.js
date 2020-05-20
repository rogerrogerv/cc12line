const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;
const cors = require('cors');
const myLiffId = process.env.MY_LIFF_ID;
const { LineClient } = require("messaging-api-line");

app.use(express.static('public'));

const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.get('/send-messages',cors(), function(req, res) {
    client.multicast(
      [process.env.USER_ID_Y, process.env.USER_ID_S, process.env.USER_ID_K, process.env.USER_ID_A, process.env.USER_ID_R],
      [
        {
          type: 'text',
          text: 'You have final warning....',
        },
      ]
    );
    res.json("success");
});

app.listen(port, () => console.log(`app listening on port ${port}!`));