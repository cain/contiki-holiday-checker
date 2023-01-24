const fetch = require("node-fetch");
const sgMail = require('@sendgrid/mail')

const TOUR_OPTION = "254196";
const TIME = "2023-06-01";
const API_ENDPOINT = "https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=" +TOUR_OPTION + "&startTimestamp=" + TIME;

const SELECTED = "2023-06-15"

exports.handler = async (event, context) => {
  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();

    const item = data.find((holiday) => holiday.startDate === SELECTED);

    const obj = {
      title: item.title,
      startDate: item.startDate,
      status: item.status,
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
        to: 'cain.hall98@gmail.com', // Change to your recipient
        from: 'cain@plannthat.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        return 'email sent';
      })
      .catch((error) => {
        console.error(error)
        return 'email error';
      })
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