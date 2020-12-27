require('dotenv').config()
const got = require('got')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const axios = require('axios')

const {
  TO_EMAIL_ADDRESS,
  FROM_EMAIL_ADDRESS,
  SENDGRID_API_KEY,
  PORT,
} = process.env

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('hello')
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse()
  const filename = `${req.body.MessageSid}.png`

  if (req.body.NumMedia !== '0') {
    const url = req.body.MediaUrl0

    axios
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const image = res.data
        console.log('response', {image})
        const attachment = Buffer.from(image).toString('base64')

        const requestBody = {
          personalizations: [{to: [{email: TO_EMAIL_ADDRESS}]}],
          from: {email: FROM_EMAIL_ADDRESS},
          subject: `New SMS message from: Tyler`,
          content: [
            {
              type: 'text/plain',
              value: 'hello',
            },
          ],
          attachments: [
            {
              content: attachment,
              filename,
              disposition: 'attachment',
            },
          ],
        }

        console.log({
          TO_EMAIL_ADDRESS,
          FROM_EMAIL_ADDRESS,
          SENDGRID_API_KEY,
          PORT,
        })

        const json = JSON.stringify(requestBody)

        axios.post('https://api.sendgrid.com/v3/mail/send', json, {
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        })
      })
      .catch((error) => {
        console.error(error)
      })

    twiml.message('Thanks for the image!')
  } else {
    twiml.message('Try sending a picture message.')
  }

  res.send(twiml.toString())
})

app.listen(PORT || 3000, () =>
  console.log('Example app listening on port 3000!'),
)
