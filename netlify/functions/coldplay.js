const fetch = require("node-fetch");
const mailgun = require("mailgun-js");

const API_ENDPOINTS = [
  "https://tixel.com/au/music-tickets/2024/11/06/coldplay-accor-stadium-sydney", 
  "https://tixel.com/au/music-tickets/2024/11/07/coldplay-accor-stadium-sydney", 
  "https://tixel.com/au/music-tickets/2024/11/10/coldplay-accor-stadium-sydney"];

exports.handler = async (event, context) => {
  try {
    let foundTickets = false;
    
    // Loop through each endpoint
    for (const API_ENDPOINT of API_ENDPOINTS) {
      // Fetch data
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        redirect: "follow"
      });
      const data = await response.text();

      const tickets = ['2 tickets', '3 tickets', '4 tickets', '5 tickets']
      const found = tickets.find((x) => data.indexOf(x) > -1 && data.indexOf(ignore) === -1);

      console.log('checking endpoint:', API_ENDPOINT);
      
      // Send email notification if tickets found
      if (found) {
        foundTickets = true;
        const regex = /<p[^>]*>\s*([^<]*section[^<]*)\s*<\/p>/gi;

        const matches = [...data.matchAll(regex)];


        let seats = [];
        matches && matches.forEach(match => {
          if(match && match.length > 0) {
            const section = match[1];
            seats.push(`seat: ${section}`);
          }
        });

        const ignore = 'seat: section 437 row 11'
        if (seats.length === 1 && seats[0].indexOf(ignore) > -1) {
          console.log('ignoring', seats[0]);
          return;
        }

        await new Promise((res, rej) => {
          const mg = mailgun({apiKey: process.env.MAILGUN, domain: process.env.MAILGUN_DOMAIN});
          const email = {
            from: `Cain <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_TO,
            subject: `Found tickets for Coldplay: ${found} ${API_ENDPOINT}`,
            text: `Found tickets at: ${API_ENDPOINT}\n\n${seats.join('\n')}`
          };
          mg.messages().send(email, function (error, body) {
            if (error) rej(error);
            res(body);
          });
        });
      }
    }

    if (!foundTickets) {
      console.log('No tickets found on any endpoint');
    }

    // Endpoint response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tickets checked' }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed checking tickets' }),
    };
  }
};

