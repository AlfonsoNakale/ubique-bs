// Form validation and submission handler
;(function () {
  // Wait for both DOM and Webflow
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback()
    } else {
      document.addEventListener('DOMContentLoaded', callback)
    }
  }

  // Initialize when everything is ready
  ready(() => {
    // Wait for Webflow to be ready
    window.Webflow &&
      window.Webflow.push(() => {
        console.log('Webflow ready, initializing forms...')
        setupForms()
      })
  })

  function setupForms() {
    // Find all forms
    const forms = document.querySelectorAll('form[data-name="Contact Form"]')
    console.log('Found forms:', forms.length)

    forms.forEach((form) => {
      // Instead of cloning, just add our handler
      form.addEventListener(
        'submit',
        function (event) {
          // Prevent Webflow's default handling
          event.preventDefault()
          event.stopPropagation()

          // Call our custom handler
          handleSubmit(event)
        },
        true
      ) // Use capture phase to ensure we handle before Webflow

      console.log('Initialized form:', form.getAttribute('data-name'))
    })
  }

  async function handleSubmit(event) {
    const form = event.target
    console.log('Form submission intercepted:', form.getAttribute('data-name'))

    // Get form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    console.log('Form data:', data)

    // Determine form type
    const isDemoForm = form.closest('.form-block.request') !== null

    // Validate form
    if (!validateForm(form, data, isDemoForm)) {
      return
    }

    try {
      await submitForm(form, data, isDemoForm)
    } catch (error) {
      console.error('Submission error:', error)
      showError(
        form,
        error.message || 'Something went wrong. Please try again.'
      )
    }
  }

  async function submitForm(form, data, isDemoForm) {
    // Update UI
    const submitButton = form.querySelector('input[type="submit"]')
    const originalValue = submitButton.value
    submitButton.value = 'Sending...'
    submitButton.disabled = true

    try {
      // Determine endpoint
      const endpoint = isDemoForm ? '/api/demo' : '/api/contact'

      // Get base URL - use your deployed API URL
      const serverUrl = 'https://ubique-bs.com' // Change this to your actual API URL

      console.log('Environment:', window.location.hostname)
      console.log('Submitting to:', `${serverUrl}${endpoint}`)

      // Send request
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.details || 'Submission failed')
      }

      // Show success and reset
      showSuccess(form)
      form.reset()
    } finally {
      // Restore button state
      submitButton.value = originalValue
      submitButton.disabled = false
    }
  }

  function validateForm(form, data, isDemoForm) {
    // Validate name
    const name = data.Name || data['req-Name-2']
    if (!validateRequired(name)) {
      showError(form, 'Please enter your name')
      return false
    }

    // Validate email
    const email = data.Email || data['req-Email-2']
    if (!validateEmail(email)) {
      showError(form, 'Please enter a valid email address')
      return false
    }

    // Validate company name for demo form
    if (isDemoForm && !validateRequired(data['req-Company-Name-2'])) {
      showError(form, 'Please enter your company name')
      return false
    }

    return true
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.toLowerCase())
  }

  function validateRequired(value) {
    return value && value.trim() !== ''
  }

  function showError(form, message) {
    console.error('Form error:', message)
    const errorDiv = form.closest('.form-block').querySelector('.error-message')
    const errorText = errorDiv.querySelector('.text-block')
    errorText.textContent = message
    errorDiv.style.display = 'block'

    // Hide success message
    const successDiv = form
      .closest('.form-block')
      .querySelector('.success-message')
    if (successDiv) {
      successDiv.style.display = 'none'
    }
  }

  function showSuccess(form) {
    console.log('Form submitted successfully')
    const successDiv = form
      .closest('.form-block')
      .querySelector('.success-message')
    if (successDiv) {
      successDiv.style.display = 'block'
    }

    // Hide error message
    const errorDiv = form.closest('.form-block').querySelector('.error-message')
    if (errorDiv) {
      errorDiv.style.display = 'none'
    }
  }
})()
