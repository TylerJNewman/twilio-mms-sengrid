const axios = require('axios')
require('dotenv').config()

const {
  TO_EMAIL_ADDRESS,
  FROM_EMAIL_ADDRESS,
  SENDGRID_API_KEY,
  PORT,
} = process.env

// const requestBody = {
//   personalizations: [{to: [{email: TO_EMAIL_ADDRESS}]}],
//   from: {email: FROM_EMAIL_ADDRESS},
//   subject: `New SMS message from: Tyler`,
//   content: [
//     {
//       type: 'text/plain',
//       value: 'hello',
//     },
//   ],
// }

console.log({
  TO_EMAIL_ADDRESS,
  FROM_EMAIL_ADDRESS,
  SENDGRID_API_KEY,
  PORT,
})

// axios.post('https://api.sendgrid.com/v3/mail/send', {
//   headers: {
//     Authorization: `Bearer ${SENDGRID_API_KEY}`,
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(requestBody),
// })

const body = {
  personalizations: [{to: [{email: 'tylerjnewman18@gmail.com'}]}],
  from: {email: 'tyler@abyss.io'},
  subject: 'New SMS message from: tyler',
  content: [
    {
      type: 'text/plain',
      value: 'hello',
    },
  ],
}

axios.post('https://api.sendgrid.com/v3/mail/send', body, {
  headers: {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
})
