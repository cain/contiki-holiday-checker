const axios = require('axios');

export default function handler(request, response) {
  const res = await axios.get('https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=254196&startTimestamp=2023-06-01');

  return response.status(200).json({ res });
}