const fetch = require("node-fetch");
const mailgun = require("mailgun-js");

const TOUR_OPTION = "ZMSS";
const TIME = "2023-07-02";
const API_ENDPOINT = "https://www.intrepidtravel.com/au/ajax/ig-departure/product-departures?date_after=" + TIME + "&departure_size=9&direction=next&product_code=" + TOUR_OPTION
const SELECTED = "2023-07-09"

exports.handler = async (event, context) => {
  try {
    // Fetch data
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();

    const item = data.departure_days.find((holiday) => holiday.departure_date === SELECTED);
    const date = new Date().toLocaleString("en-US", {timeZone: "Australia/Sydney"});
    const status = (item.all_departures_fully_booked || item.departure_day_places_left) > 0 ? 'CLOSED' : 'OPEN';
    const message = `${status} Rome to Amalfi ${item.departure_date}. Time: ${date}`;

    // Send email notification
    if(status !== 'CLOSED') {
      await new Promise((res, rej) => {
        const mg = mailgun({apiKey: process.env.MAILGUN, domain: process.env.MAILGUN_DOMAIN});
        const email = {
          from: `Cain <${process.env.EMAIL_FROM}>`,
          to: process.env.EMAIL_TO,
          subject: item.title,
          text: message
        };
        mg.messages().send(email, function (error, body) {
          if (error) rej(error);
          res(body);
        });
      });
    } else {
      // message for netfliy logs
      console.log(message);
    }

    // Endpoint response
    return {
      statusCode: 200,
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

