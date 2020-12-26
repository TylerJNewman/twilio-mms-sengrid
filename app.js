require('dotenv').config()
const got = require('got')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('hello')
})

app.get('/sms', (req, res) => {
  const twiml = new MessagingResponse()
  const filename = `hello.png`
  function base64Encode(file) {
    const body = fs.readFileSync(file)
    return new Buffer(body).toString('base64')
  }

  const attachment = base64Encode('hello.png')

  const requestBody = {
    personalizations: [{to: [{email: process.env.TO_EMAIL_ADDRESS}]}],
    from: {email: process.env.FROM_EMAIL_ADDRESS},
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
        // type: 'image/png',
        disposition: 'attachment',
      },
    ],
  }

  got
    .post('https://api.sendgrid.com/v3/mail/send', {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then((response) => {
      // let twiml = new MessagingResponse()
    })
    .catch((err) => {
      console.log(err)
    })

  twiml.message('Thanks for the image!')

  // res.send(twiml.toString())
  res.send(requestBody)
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse()

  if (req.body.NumMedia !== '0') {
    // const filename = `${req.body.MessageSid}.png`
    const filename = `hello.png`
    const url = req.body.MediaUrl0

    // Download the image.
    request(url)
      .pipe(fs.createWriteStream(filename))
      .on('close', () => console.log('Image downloaded.'))

    function base64Encode(file) {
      const body = fs.readFileSync(file)
      return new Buffer(body).toString('base64')
    }

    const attachment = base64Encode('hello.png')

    const requestBody = {
      personalizations: [{to: [{email: process.env.TO_EMAIL_ADDRESS}]}],
      from: {email: process.env.FROM_EMAIL_ADDRESS},
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
          // type: 'image/png',
          disposition: 'attachment',
        },
      ],
    }

    got
      .post('https://api.sendgrid.com/v3/mail/send', {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then((response) => {
        // let twiml = new MessagingResponse()
      })
      .catch((err) => {
        console.log(err)
      })

    twiml.message('Thanks for the image!')
  } else {
    twiml.message('Try sending a picture message.')
  }

  res.send(twiml.toString())
})

app.listen(process.env.PORT || 3000, () =>
  console.log('Example app listening on port 3000!'),
)
