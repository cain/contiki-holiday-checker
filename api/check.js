import fetch from 'node-fetch';

export default function handler(request, response) {
  const res = await fetch('https://www.contiki.com/en-au/tours/getdatespricing?tourOptionId=254196&startTimestamp=2023-06-01', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();
  return response.status(200).json({ data });
}