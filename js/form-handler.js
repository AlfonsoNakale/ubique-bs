// Form validation and submission handler
;(function () {
  // Wait for Webflow to initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForms)
  } else {
    initializeForms()
  }

  function initializeForms() {
    // Make sure Webflow is loaded
    if (window.Webflow) {
      window.Webflow.destroy()
      window.Webflow.ready()
      window.Webflow.require('ix2').init()
    }

    // Initialize forms after a short delay to ensure Webflow's forms are fully loaded
    setTimeout(setupForms, 100)
  }

  function setupForms() {
    // Find all forms
    const forms = document.querySelectorAll('form[data-name="Contact Form"]')
    console.log('Found forms:', forms.length)

    forms.forEach((form) => {
      // Remove existing listeners and clone
      const newForm = form.cloneNode(true)
      form.parentNode.replaceChild(newForm, form)

      // Add our custom handler
      newForm.addEventListener('submit', handleSubmit)

      // Disable Webflow's form behavior
      newForm.setAttribute('data-wf-page', '')
      newForm.setAttribute('data-wf-element-id', '')

      console.log('Initialized form:', newForm.getAttribute('data-name'))
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

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

  async function submitForm(form, data, isDemoForm) {
    // Update UI
    const submitButton = form.querySelector('input[type="submit"]')
    const originalValue = submitButton.value
    submitButton.value = 'Sending...'
    submitButton.disabled = true

    try {
      // Determine endpoint
      const endpoint = isDemoForm ? '/api/demo' : '/api/contact'

      // Use the correct server URL based on environment
      const serverUrl = 'https://ubique-bs.com' // Always use production URL

      console.log('Form data being sent:', data)
      console.log('Submitting to:', `${serverUrl}${endpoint}`)

      // Send request
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      console.log(
        'Response headers:',
        Object.fromEntries(response.headers.entries())
      )

      // First check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Then try to parse JSON
      let responseData
      try {
        const text = await response.text()
        console.log('Raw response:', text)
        responseData = text ? JSON.parse(text) : {}
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError)
        throw new Error('Server response was not in valid JSON format')
      }

      if (responseData.error) {
        throw new Error(responseData.error)
      }

      // Show success and reset
      showSuccess(form)
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      showError(
        form,
        error.message || 'Something went wrong. Please try again.'
      )
    } finally {
      // Restore button state
      submitButton.value = originalValue
      submitButton.disabled = false
    }
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
