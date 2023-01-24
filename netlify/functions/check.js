const fetch = require("node-fetch");

const TOUR_OPTION = "254196";
const TIME = "2023-06-01";
const API_ENDPOINT = "https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=" +TOUR_OPTION + "&startTimestamp=" + TIME;

exports.handler = async (event, context) => {
  const response = fetch(API_ENDPOINT, { headers: { Accept: "application/json" } })
    .then((response) => response.json())
    .catch((error) => ({ statusCode: 422, body: String(error) }));

  if(response.statusCode === 422) {
    return response;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};