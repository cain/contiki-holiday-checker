import axios from 'axios';

export default function handler(request, response) {
  axios.get('https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=254196&startTimestamp=2023-06-01')
    .then((res) => {
      return response.status(200).json({ res });
    })
}