require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Resend } = require('resend')

const app = express()
const port = process.env.PORT || 3000

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('.')) // Serve static files from current directory

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { Name, Email, Message } = req.body

    await resend.emails.send({
      from: 'UBS Contact Form <onboarding@resend.dev>',
      to: 'alfonso.nakale@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${Name}</p>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Message:</strong> ${Message}</p>
            `,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// Demo request endpoint
app.post('/api/demo', async (req, res) => {
  try {
    const {
      'req-Name-2': Name,
      'req-Email-2': Email,
      'req-Company-Name-2': Company,
      'Number-of-users-2': Users,
      'req-Message-2': Message,
    } = req.body

    await resend.emails.send({
      from: 'UBS Demo Request <onboarding@resend.dev>',
      to: 'alfonso.nakale@gmail.com',
      subject: 'New Demo Request',
      html: `
                <h2>New Demo Request</h2>
                <p><strong>Name:</strong> ${Name}</p>
                <p><strong>Company:</strong> ${Company}</p>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Number of Users:</strong> ${
                  Users || 'Not specified'
                }</p>
                <p><strong>Additional Information:</strong> ${
                  Message || 'None provided'
                }</p>
            `,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
