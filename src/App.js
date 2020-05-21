import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import icon from "./img/icon.png";
import phone from "./img/phone_image.png";
// import Horoscope from "./horoscope"

function App() {
  // let myLiffId = "1654236980-8Pzx0pWj"

  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //this is just for testing. will delete this later
  // const [fakeStatus, setFakeStatus] = useState(true);


  useEffect(() => {
    initialize();

    if(window.liff.isLoggedIn){
      getUserId()
    }
  }, []);


  function initialize() {
    let myLiffId = "";

    fetch("/send-id")
      .then(function (reqResponse) {
        console.log("reqResponse", reqResponse.body);
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        console.log("jsonresponseeee", jsonResponse);
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
      // document.getElementById("liffAppContent").classList.add('hidden');
      // document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
      initializeLiff(myLiffId);
    }
  }

  function initializeLiff(myLiffId) {
    console.log("myLIffid--------->", myLiffId);
    console.log("Is user logged in????", window.liff.isLoggedIn)
    window.liff
      .init({
        liffId: myLiffId,

      })
      .then(() => {
        // start to use LIFF's api
        initializeApp();
        const idToken = window.liff.getDecodedIDToken();
        console.log("app.js line68 initializeLiff -> idToken*****", idToken);
        
      })
      .catch((err) => {
        console.log(err);
        // document.getElementById("liffAppContent").classList.add('hidden');
        // document.getElementById("liffInitErrorMessage").classList.remove('hidden');
      });
  }

  function initializeApp() {
    // displayLiffData();
    // displayIsInClientInfo();
    // registerButtonHandlers();

    // check if the user is logged in/out, and disable inappropriate button
    if (window.liff.isLoggedIn()) {
      // document.getElementById('liffLoginButton').disabled = true;
      function Button () {return ( 
        <>
        <div className="buttonRow">
        <button id="scanQrCodeButton" className="liffLoginButton" onClick={() => sendCovidStatus()}>
          Get COVID Status
        </button>
        <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendJoke()}>
          Get Joke
        </button>
        <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendFortune()}>
          Get Your Fortune
        </button>
        {/* <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendNews()}>
          Get News
        </button>  */}
      </div>
      {/* <div className="buttonRow">
      <button id="getAccessToken" className="liffLoginButton">Get Access Token</button>
      <button id="getProfileButton" className="liffLoginButton">Get Profile</button>
      </div> */}
      </>)
      }
    }
    // } else {
    //   // document.getElementById('liffLogoutButton').disabled = true;
    // }
  }

  function loginClick() {

    if (!window.liff.isLoggedIn()) {
      console.log("loginClick -> window.liff.isLoggedIn()******", window.liff.isLoggedIn())
      // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
     
      // window.liff.login({ redirectUri: "http://localhost:9000" });
      console.log("Before login*******")
      window.liff.login();
      console.log("After login****")
      getUserId();
      console.log("After login getuserID()******")
      setIsLoggedIn(true);
    }
  }

  function getUserId() {
    if(window.liff.isLoggedIn){
    window.liff
      .getProfile()
      .then((profile) => {
        const profileName = profile.displayName;
        setUserId(profile.userId);
        // setIsLoggedIn(window.liff.isLoggedIn());
        // setTimeout(() => {
        console.log("app.js profile name, userid line103 ========>", profileName, userId);
        // }, 3000)

      })
      .catch((err) => {
        console.log("error", err);
      });
    }
  }

  function time(){
    // Set interval for checking

    var date = new Date();
    // Create a Date object to find out what time it is
    // if(date.getHours() === 0 && date.getMinutes() === 38 && date.getSeconds() === 0){
    if(date.getSeconds() === 0){
      // Check the time
      console.log("now is", date);
      // sendMessages();
  }}

  let interval;
  // window.clearInterval(interval)
  window.setInterval(time, 1000);

  function sendMessages() {
    getUserId();
    fetch(`/send-messages?userId=${userId}`).then((res) => 
    console.log("THIS IS A RESPONSE FOR MESSAGES!!------>", res));
  }

  function sendJoke() {
    // getUserId();
    console.log("inside sendJoke", userId)

    fetch(`/joke?userId=${userId}`).then((res) =>
      console.log("THIS IS A RESPONSE FOR JOKES!!------>", JSON.stringify(res.data))
    );
  }


  function sendCovidStatus() {
    getUserId();
    console.log("inside CovidStatus", userId)
    fetch(`/covid?userId=${userId}`).then((res) =>
      console.log("THIS IS A RESPONSE FOR COVID!!------>", res)
    );
  }

  function sendFortune() {
    getUserId();
    console.log("***inside sendFortune ****", userId);
    fetch(`/fortune?userId=${userId}`).then((res) =>
      console.log("THIS IS A RESPONSE FOR fortune !!------>", res)
    );
  }

  function sendNews () {
    getUserId();
    fetch(`/news?userId=${userId}`).then((res) =>
    console.log("THIS IS A RESPONSE FOR news !!------>", res)
  );
  }


  // let test = false;

  function Buttons() {
    // if(isLoggedIn) {
      return ( 
      <>
      <div className="buttonRow">
      <button id="scanQrCodeButton" className="liffLoginButton" onClick={() => sendCovidStatus()}>
        Get COVID Status
      </button>
      <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendJoke()}>
        Get Joke
      </button>
      <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendFortune()}>
        Get Your Fortune
      </button>
      <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendNews()}>
        Get News
      </button> 
    </div>
    {/* <div className="buttonRow">
    <button id="getAccessToken" className="liffLoginButton">Get Access Token</button>
    <button id="getProfileButton" className="liffLoginButton">Get Profile</button>
    </div> */}
    </>)
    } 
    // else {
    //  return  <h1>please login first</h1>
    // }
  // }

  return (
    <div className="App">
      <div id="liffAppContent">
      <div className="intro-section">
        <div className="title-wrapper">
        <p id="title">SKYRA</p>
        </div>
        <img id="icon" src={icon}></img>
        <p className="marketInfo">Subcribe to SKYRA to get COVID-19 stats, Dad Jokes, Fortunes and more delivered to your Line daily.</p>
        <p className="marketInfo">Start by logging into your line account</p>
        <button className="liffLoginButton" onClick={() => loginClick()}>
              Log in
        </button>
      </div>
      <div className={"add-assistant-section"}>
      <p className="market-subInfo">Use this QR code to add SKYRA to your Line and wait for the messages!</p>
      <img className="phone_pic" alt="phone_pic" src={phone}></img>
      <img className="qrcode" alt="qrcode_pic" src="/151tshrj.png"></img>
      <p className="market-subInfo">You will get a message every morning at 10:00(JST)</p>
      </div>
        {/* <!-- ACTION BUTTONS --> */}
        <div className="buttonGroup">
          {/* <div className="buttonRow">
          </div> */}
          <Buttons />
          {/* <div className="buttonRow"></div>
            <button id="scanQrCodeButton" className="liffLoginButton" onClick={() => sendCovidStatus()}>
              Get COVID Status
            </button>
            <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendJoke()}>
              Get Joke
            </button>
            <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendFortune()}>
              Get Your Fortune
            </button>
            <button id="sendMessageButton" className="liffLoginButton" onClick={() => sendNews()}>
              Get News
            </button> 
          </div> */}
          {/* <p>How about your Horoscope?</p> */}
          {/* <Horoscope sign={sign} day={day}/>x */}
          {/* <div className="buttonRow">
            <button id="getAccessToken" className="liffLoginButton">Get Access Token</button>
            <button id="getProfileButton" className="liffLoginButton">Get Profile</button>
          </div> */}
        </div>
        <div id="hooter">© SKYRA 2020. All rights reserved.</div>
        <div id="shareTargetPickerMessage"></div>
        {/* <!-- ACCESS TOKEN DATA --> */}
        <div id="accessTokenData" className="hidden textLeft">
          <h2>Access Token</h2>
          <a href="#">Close Access Token</a>
          <table>
            <tr>
              <th>accessToken</th>
              <td id="accessTokenField"></td>
            </tr>
          </table>
        </div>
        {/* <!-- SCAN QR RESULT --> */}
        <div id="scanQr" className="hidden textLeft">
          <h2>QR Code reader</h2>
          <a href="#">Close QR Code Reader Result</a>
          <table>
            <tr>
              <th>scanCode Result</th>
              <td id="scanQrField"></td>
            </tr>
          </table>
        </div>
        {/* <!-- PROFILE INFO --> */}
        <div id="profileInfo" className="hidden textLeft">
          <h2>Profile</h2>
          <a href="#">Close Profile</a>
          <div id="profilePictureDiv"></div>
          <table>
            <tr>
              <th>userId</th>
              <td id="userIdProfileField"></td>
            </tr>
            <tr>
              <th>displayName</th>
              <td id="displayNameField"></td>
            </tr>
            <tr>
              <th>statusMessage</th>
              <td id="statusMessageField"></td>
            </tr>
          </table>
        </div>
        {/* <!-- LOGIN LOGOUT BUTTONS --> */}
        {/* <div className="buttonGroup">
          <button id="liffLoginButton" >Log in</button>
          <button id="liffLogoutButton">Log out</button>
        </div> */}
        {/* <div id="statusMessage">
          <div id="isInClientMessage"></div>
          <div id="apiReferenceMessage">
            <p>
              Available LIFF methods vary depending on the browser you use to
              open the LIFF app.
            </p>
            <p>
              Please refer to the{" "}
              <a href="https://developers.line.biz/en/reference/liff/#initialize-liff-app">
                API reference page
              </a>{" "}
              for more information.
            </p>
          </div>
        </div> */}
      </div>
      {/* <!-- LIFF ID ERROR --> */}
      <div id="liffIdErrorMessage" className="hidden">
        <p>You have not assigned any value for LIFF ID.</p>
        <p>
          If you are running the app using Node.js, please set the LIFF ID as an
          environment variable in your Heroku account follwing the below steps:{" "}
        </p>
        <code id="code-block">
          <ol>
            <li>Go to `Dashboard` in your Heroku account.</li>
            <li>Click on the app you just created.</li>
            <li>Click on `Settings` and toggle `Reveal Config Vars`.</li>
            <li>Set `MY_LIFF_ID` as the key and the LIFF ID as the value.</li>
            <li>
              Your app should be up and running. Enter the URL of your app in a
              web browser.
            </li>
          </ol>
        </code>
        <p>
          If you are using any other platform, please add your LIFF ID in the{" "}
          <code>index.html</code> file.
        </p>
        <p>
          For more information about how to add your LIFF ID, see{" "}
          <a href="https://developers.line.biz/en/reference/liff/#initialize-liff-app">
            Initializing the LIFF app
          </a>
          .
        </p>
      </div>
      {/* <!-- LIFF INIT ERROR --> */}
      <div id="liffInitErrorMessage" className="hidden">
        <p>Something went wrong with LIFF initialization.</p>
        <p>
          LIFF initialization can fail if a user clicks "Cancel" on the "Grant
          permission" screen, or if an error occurs in the process of{" "}
          <code>window.liff.init()</code>.
        </p>
      </div>
      {/* <!-- NODE.JS LIFF ID ERROR --> */}
      <div id="nodeLiffIdErrorMessage" className="hidden">
        <p>Unable to receive the LIFF ID as an environment variable.</p>
      </div>
    </div>
  );
}

export default App;
