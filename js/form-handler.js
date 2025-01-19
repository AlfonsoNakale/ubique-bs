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

    // Update UI
    const submitButton = form.querySelector('input[type="submit"]')
    const originalValue = submitButton.value
    submitButton.value = 'Sending...'
    submitButton.disabled = true

    try {
      // Send request to PHP handler
      const response = await fetch('form-handler.php', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(form)
        form.reset()
      } else {
        const errorMessage = result.message + '\n' + result.errors.join('\n')
        showError(form, errorMessage)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      showError(form, 'Something went wrong. Please try again.')
    } finally {
      // Restore button state
      submitButton.value = originalValue
      submitButton.disabled = false
    }
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
