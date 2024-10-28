const fetch = require("node-fetch");
const mailgun = require("mailgun-js");

const API_ENDPOINT = "https://tixel.com/au/music-tickets/2024/11/10/coldplay-accor-stadium-sydney";

exports.handler = async (event, context) => {
  try {
    // Fetch data
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      redirect: "follow"
    });
    const data = await response.text();

    const tickets = ['2 tickets', '3 tickets', '4 tickets', '5 tickets']
    const found = tickets.some((x) => data.indexOf(x) > -1);

    console.log('data', data)
    // Send email notification
    if(found) {
      await new Promise((res, rej) => {
        const mg = mailgun({apiKey: process.env.MAILGUN, domain: process.env.MAILGUN_DOMAIN});
        const email = {
          from: `Cain <${process.env.EMAIL_FROM}>`,
          to: process.env.EMAIL_TO,
          subject: 'found ticket for coldlay',
          text: `found ticket ${API_ENDPOINT}`
        };
        mg.messages().send(email, function (error, body) {
          if (error) rej(error);
          res(body);
        });
      });
    } else {
      // message for netfliy logs
      console.log(data);
    }

    // Endpoint response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
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

