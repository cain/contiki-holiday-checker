const fetch = require("node-fetch");

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