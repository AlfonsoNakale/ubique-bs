require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Resend } = require('resend')

const app = express()
const port = process.env.PORT || 3000

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// CORS configuration
const corsOptions = {
  origin: ['https://ubique-bs.com', 'http://localhost:8080'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  console.log('Request body:', req.body)
  next()
})

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('Contact form submission received:', req.body)

  try {
    const { Name, Email, Message } = req.body

    console.log('Sending email with data:', { Name, Email, Message })

    const emailResponse = await resend.emails.send({
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

    console.log('Email sent successfully:', emailResponse)
    res.json({ success: true })
  } catch (error) {
    console.error('Email error details:', error)
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    })
  }
})

// Demo request endpoint
app.post('/api/demo', async (req, res) => {
  console.log('Demo request received:', req.body)

  try {
    const {
      'req-Name-2': Name,
      'req-Email-2': Email,
      'req-Company-Name-2': Company,
      'Number-of-users-2': Users,
      'req-Message-2': Message,
    } = req.body

    console.log('Sending demo request email with data:', {
      Name,
      Email,
      Company,
      Users,
      Message,
    })

    const emailResponse = await resend.emails.send({
      from: 'UBS Demo Request <onboarding@resend.dev>',
      to: 'alfonso.nakale@gmail.com',
      subject: 'New Demo Request',
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Company:</strong> ${Company}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Number of Users:</strong> ${Users || 'Not specified'}</p>
        <p><strong>Additional Information:</strong> ${
          Message || 'None provided'
        }</p>
      `,
    })

    console.log('Demo request email sent successfully:', emailResponse)
    res.json({ success: true })
  } catch (error) {
    console.error('Demo request email error details:', error)
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log('CORS enabled for:', corsOptions.origin)
})
