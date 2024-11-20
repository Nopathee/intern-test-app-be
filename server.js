const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')
const cron = require('node-cron') 

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

app.post('/api/intern/submit', (req, res) => {
  const { name, email, startDate, welcomeEmail } = req.body

  const emailDate = new Date(startDate)
  emailDate.setDate(emailDate.getDate() - 5) 

  if (welcomeEmail) {

    const cronTime = `0 9 ${emailDate.getDate()} ${
      emailDate.getMonth() + 1
    } *`

    cron.schedule(cronTime, () => {
      sendWelcomeEmail(name, email, startDate)
        .catch((err) => {
          console.error('Error sending email:', err)
        })
    })

    res
      .status(200)
      .send(
        `Welcome email will be sent to ${email} on ${emailDate.toDateString()}`
      )
  } else {
    res.status(200).send('No welcome email scheduled')
  }
})


async function sendWelcomeEmail(name, email, startDate) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nopatheeinternweb@gmail.com', 
      pass: 'qrlc ucow ekos zdtn', 
    },
  })

  const displayDate = new Date(startDate)

  const mailOptions = {
    from: 'nopatheeinternweb@gmail.com',
    to: email,
    subject: `Welcome onboard for Programmer Trainee position on ${displayDate.toDateString()}`,
    text: `Welcome onboard for the Programmer Trainee position on ${displayDate.toDateString()}.
    \nName: ${name}
    \nPosition: Programmer Trainee
    \nStart Date: ${displayDate.toDateString()}`,
  }

  return transporter.sendMail(mailOptions) 
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
