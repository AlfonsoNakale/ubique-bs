// Form validation and submission handler
document.addEventListener('DOMContentLoaded', function () {
  // Get both forms
  const contactForm = document.querySelector('#wf-form-Contact-Form')
  const demoForm = document.querySelector(
    '.form-block.request #wf-form-Contact-Form'
  )

  // Validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.toLowerCase())
  }

  function validateRequired(value) {
    return value.trim() !== ''
  }

  function showError(form, message) {
    console.error('Form error:', message)
    const errorDiv = form.closest('.form-block').querySelector('.error-message')
    const errorText = errorDiv.querySelector('.text-block')
    errorText.textContent = message
    errorDiv.style.display = 'block'

    // Hide success message if visible
    const successDiv = form
      .closest('.form-block')
      .querySelector('.success-message')
    successDiv.style.display = 'none'
  }

  function showSuccess(form) {
    console.log('Form submitted successfully')
    const successDiv = form
      .closest('.form-block')
      .querySelector('.success-message')
    successDiv.style.display = 'block'

    // Hide error message if visible
    const errorDiv = form.closest('.form-block').querySelector('.error-message')
    errorDiv.style.display = 'none'
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target

    console.log('Form submission started')

    // Get form fields
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    console.log('Form data:', data)

    // Validate required fields
    if (!validateRequired(data.Name || data['req-Name-2'])) {
      showError(form, 'Please enter your name')
      return
    }

    if (!validateEmail(data.Email || data['req-Email-2'])) {
      showError(form, 'Please enter a valid email address')
      return
    }

    // Additional validation for demo form
    if (form === demoForm && !validateRequired(data['req-Company-Name-2'])) {
      showError(form, 'Please enter your company name')
      return
    }

    try {
      // Disable submit button and show loading state
      const submitButton = form.querySelector('input[type="submit"]')
      const originalValue = submitButton.value
      submitButton.value = 'Sending...'
      submitButton.disabled = true

      // Determine which endpoint to use based on the form
      const endpoint = form === demoForm ? '/api/demo' : '/api/contact'
      console.log('Sending to endpoint:', endpoint)

      // Get the server URL based on environment
      const serverUrl =
        window.location.hostname === 'localhost'
          ? 'http://localhost:3000'
          : 'https://ubique-bs.com'

      // Send the data to our server
      console.log('Sending request to:', `${serverUrl}${endpoint}`)
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.details || 'Network response was not ok')
      }

      // Show success message and reset form
      showSuccess(form)
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      showError(
        form,
        error.message || 'Something went wrong. Please try again.'
      )
    } finally {
      // Re-enable submit button and restore original text
      const submitButton = form.querySelector('input[type="submit"]')
      submitButton.value = originalValue
      submitButton.disabled = false
    }
  }

  // Add submit event listeners to both forms
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit)
    console.log('Contact form handler attached')
  }
  if (demoForm) {
    demoForm.addEventListener('submit', handleSubmit)
    console.log('Demo form handler attached')
  }
})
