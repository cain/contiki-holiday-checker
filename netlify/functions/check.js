const fetch = require("node-fetch");
const mailgun = require("mailgun-js");

// https://docs.netlify.com/functions/scheduled-functions/#cron-expression-inline-in-function-code
// const { schedule } = require("@netlify/functions");

const TOUR_OPTION = "254196";
const TIME = "2023-06-01";
const API_ENDPOINT = "https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=" + TOUR_OPTION + "&startTimestamp=" + TIME;

const SELECTED = "2023-06-15"

exports.handler =  async (event, context) => {
  try {

    // Fetch data
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();

    // Find selected data
    const item = data.find((holiday) => holiday.startDate === SELECTED);
    const message = `${item.title} ${item.startDate} ${item.status}`;

    // Send email notification
    const mg = mailgun({apiKey: process.env.MAILGUN, domain: process.env.MAILGUN_DOMAIN});
    const email = {
      from: 'Cain <cain.hall98@gmail.com>',
      to: 'cain@plannthat.com',
      subject: 'Checking Contiki',
      text: message
    };
    await mg.messages().send(email, function (error, body) {
      console.log(body);
    });

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
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

// exports.handler = schedule("@daily", handler);