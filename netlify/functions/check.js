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
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();

    const item = data.find((holiday) => holiday.startDate === SELECTED);

    const obj = {
      title: item.title,
      startDate: item.startDate,
      status: item.status,
    }
    const DOMAIN = 'sandbox076fd55095094b549b4c51d011f58619.mailgun.org';
    const mg = mailgun({apiKey: process.env.MAILGUN, domain: DOMAIN});
    const email = {
      from: 'Excited User <me@sandbox076fd55095094b549b4c51d011f58619.mailgun.org>',
      to: 'cain@plannthat.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!'
    };
    await mg.messages().send(email, function (error, body) {
      console.log(body);
    });
    return {
      statusCode: 200,
      body: JSON.stringify(obj),
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