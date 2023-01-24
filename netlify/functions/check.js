const fetch = require("node-fetch");
const mailgun = require("mailgun-js");

// https://docs.netlify.com/functions/scheduled-functions/#cron-expression-inline-in-function-code
// const { schedule } = require("@netlify/functions");

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
    const DOMAIN = 'cainhall.com.au';
    const mg = mailgun({apiKey: process.env.MAILGUN, domain: DOMAIN});
    const email = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: 'cain@plannthat.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!'
    };
    mg.messages().send(email, function (error, body) {
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