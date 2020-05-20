//  https://english.api.rakuten.net/sameer.kumar/api/aztro/endpoints
//  Get your ♋ horoscope ♍
import React from "react";

export const Horoscope = (sign, day) => {

  // const signType = {
  //   ARIES: "aries",
  //   TAURUS: "taurus",
  //   GEMINI: "gemini",
  //   CANCER: "cancer",
  //   LEO: "leo",
  //   VIRGO: "virgo",
  //   LIBRA: "libra",
  //   SCORPIO: "scorpio",
  //   SAGITTARIUS: "sagittarius",
  //   CAPRICORN: "capricorn",
  //   AQUARIUS: "aquarius",
  //   PISCES: "pisces"
  // };

  // const dayType = {
  //   YESTERDAY: "yesterday",
  //   TODAY: "today",
  //   TOMORROW: "tomorrow"
  // }
  


  const URL = `https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`;
  
  let horoscope = {
    json: {}
  }

  fetch(URL, {
    method: "POST"
    })
    .then(response => response.json())
    .then(json => { horoscope = json });


  return (
    <div>
      Current Date: {horoscope.json.current_date} <br />
      Compatibility: {horoscope.json.compatibility} <br />
      Lucky Number: {horoscope.json.lucky_number} <br />
      Lucky Time: {horoscope.json.lucky_time} <br />
      Color: {horoscope.json.color} <br />
      Date Range: {horoscope.json.date_range} <br />
      Mood: {this.horoscope.mood} <br />
      Description: {horoscope.json.description} <br />
    </div>
  )
}